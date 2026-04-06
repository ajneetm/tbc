import {  updateDay } from "@/store/chatbot/Booking";
import { updateChatTrailing } from "@/store/chatbot/ChatController";
import { sendMsg } from "@/store/chatbot/ChatSlice";
import { AppDispatch } from "@/store/store";
import sleep from "@/utils/sleep";
import { v4 as uuid } from "uuid";

export function handleBookingDateSelection(
  dispatch: AppDispatch,
  selectedDate: Date | undefined,
) {
  return async () => {
    dispatch(updateChatTrailing("none"));
    const date = selectedDate?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    dispatch(updateDay(date || ""));
    dispatch(
      sendMsg({
        message: {
          id: uuid(),
          msgType: "text",
          msgSender: "user",
          msg_body: date || "",
        },
      }),
    );
    await sleep(500);
    dispatch(
      sendMsg({
        message: {
          id: uuid(),
          msgType: "text",
          msgSender: "chatbot",
          msg_body: `Great! Now let’s pick a suitable hour in ${date}.`,
        },
      }),
    );
    await sleep(500);
    dispatch(updateChatTrailing("time"));
  };
}

export async function startBooking(dispatch: AppDispatch) {
  dispatch(
    sendMsg({
      message: {
        id: uuid(),
        msgType: "text",
        msgSender: "chatbot",
        msg_body: "Book a one hour free consultation, please pick a suitable time for you.",
      },
    })
  );
  await sleep(500);
  dispatch(updateChatTrailing("date"));
}

