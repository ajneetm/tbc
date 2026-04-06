"use client";
import { bookingHour } from "@/app/libs/api/chat";
import { TimeRange } from "@/app/libs/api/chatTypes";
import { Button } from "@/components/ui/button";
import { updateTime } from "@/store/chatbot/Booking";
import { updateChatTrailing } from "@/store/chatbot/ChatController";
import { sendMsg, setIsDisabled } from "@/store/chatbot/ChatSlice";
import { useDispatch, useSelector } from "@/store/hooks";
import { MsgSender } from "@/types/chat";
import { cn } from "@/utils/cn";
import sleep from "@/utils/sleep";
import { cva } from "class-variance-authority";
import { format, parse } from "date-fns";
import { useTransition } from "react";
import { v4 as uuid } from "uuid";
import ChatLoading from "../MessageTemplates/ChatLoading";
import toast from "react-hot-toast";
import { trailingItemsIds } from "../Layout/ChatContent";

const variants = cva([
  "grid grid-cols-2 max-w-max gap-[10px] flex-wrap w-[400px]",
]);
export type TimeMessageProps = {
  msgSender: MsgSender;
  messageId: string;
};

function BookingTime() {
  const dispatch = useDispatch();
  const { day, availableDates } = useSelector((state) => state.booking);

  const [isPending, startTransition] = useTransition();

  const handleBookingHour = async (time: TimeRange) => {
    try {
      await bookingHour({
        book_date: format(day, "yyyy-MM-dd"),
        book_from: time.from,
        book_to: time.to,
      });
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      return false;
    }
  };

  const mappedAvailableDates =
    availableDates[format(day || new Date(), "yyyy-MM-dd")] || [];
  const handlePickTime = async (time: TimeRange) => {
    const formattedTime = `${timeFormatter(time.from)} - ${timeFormatter(time.to)}`;

    startTransition(async () => {
      const isBooked = await handleBookingHour(time);
      if (!isBooked) return;

      startTransition(async () => {
        dispatch(
          sendMsg({
            message: {
              id: uuid(),
              msgType: "text",
              msgSender: "user",
              msg_body: `${formattedTime} ${day}`,
            },
          }),
        );
        dispatch(updateChatTrailing("none"));
        dispatch(updateTime(formattedTime));
        await sleep(500);
        dispatch(
          sendMsg({
            message: {
              id: uuid(),
              msgType: "text",
              msgSender: "chatbot",
              msg_body: `Thank you!\nLooking forward to meet you at Your free one hour consultation\n\n${day}\nFrom ${time.from} to ${time.to}`,
            },
          }),
        );
        dispatch(updateChatTrailing("initial-prompts"));
      });
    });

    dispatch(setIsDisabled(false));
  };
  const timeFormatter = (time: string) => {
    const parsedTime = parse(time, "HH:mm:ss", new Date());

    // Format the time in 12-hour format with AM/PM
    const formattedTime = format(parsedTime, "hh:mm a");
    return formattedTime;
  };
  if (isPending) {
    return <ChatLoading msgSender="chatbot" />;
  }
  return (
    <div className={cn(variants())} id={trailingItemsIds.time}>
      {mappedAvailableDates.length > 0 ? (
        mappedAvailableDates.map((date, index, array) => (
          <div
            key={index}
            className={cn({
              "col-span-2":
                array.length - 1 === index && array.length % 2 === 1,
            })}
          >
            <Button
              variant="secondary"
              className="w-full hover:outline hover:outline-1 hover:outline-[#F04438] shadow-md"
              onClick={() => {
                handlePickTime(date);
              }}
            >
              {`${timeFormatter(date.from)} - ${timeFormatter(date.to)}`}
            </Button>
          </div>
        ))
      ) : (
        <div className="col-span-2">No available time</div>
      )}
    </div>
  );
}

export default BookingTime;
