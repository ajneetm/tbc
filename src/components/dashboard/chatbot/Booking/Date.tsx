"use client";
import { getAvailableTimeList } from "@/app/libs/api/chat";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { setAvailableDates } from "@/store/chatbot/Booking";
import { useDispatch, useSelector } from "@/store/hooks";
import { MsgSender } from "@/types/chat";
import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { handleBookingDateSelection } from "../helpers/booking";
import { trailingItemsIds } from "../Layout/ChatContent";
import Link from "next/link";
import { setIsDisabled } from "@/store/chatbot/ChatSlice";

const variants = cva([
  " border border-[#E4E7EC] max-w-max rounded-xl  px-4 py-[10px] shadow-lg",
  "text-pretty ",
]);
export type DateMessageProps = {
  msgSender: MsgSender;
  messageId: string;
};

function BookingDate() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<{
    hasError: boolean;
    retry: number;
  }>({
    hasError: false,
    retry: 0,
  });
  const dispatch = useDispatch();
  const handleApply = handleBookingDateSelection(dispatch, selectedDate);
  const { availableDates } = useSelector((state) => state.booking);

  useEffect(() => {
    (async function fetchData() {
      try {
        setIsLoading(true);
        const res = await getAvailableTimeList();
        dispatch(setAvailableDates(res));
        setHasError({
          hasError: false,
          retry: hasError.retry,
        });
        const noAvailableDates = Object.keys(res).length === 0;
        if (noAvailableDates) {
          dispatch(setIsDisabled(false));
        }
      } catch (error) {
        setHasError({
          hasError: true,
          retry: hasError.retry,
        });
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [hasError.retry]);

  const mappedAvailableDates = Object.keys(availableDates).map(
    (date) => new Date(date),
  );
  const noAvailableDates = mappedAvailableDates.length === 0 && !isLoading;

  return (
    <div className={cn(variants())} id={trailingItemsIds.date}>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        disabled={(date: Date) =>
          !mappedAvailableDates.some(
            (d: Date) =>
              d.getFullYear() === date.getFullYear() &&
              d.getMonth() === date.getMonth() &&
              d.getDate() === date.getDate(),
          )
        } // Optional range limits
        modifiers={{
          available: mappedAvailableDates,
        }}
        modifiersClassNames={{
          available: cn(
            "[&]:relative [&]:before:absolute [&]:before:size-[5px] [&]:before:rounded-full",
            "[&]:before:bg-red-500 [&]:before:content-[''] [&]:before:bottom-0 [&]:before:left-1/2",
            "[&]:before:-translate-y-1/2 [&]:before:-translate-x-1/2 [&]:before:z-10",
          ),
        }}
      />
      {noAvailableDates && (
        <small className="text-red-500">No available dates</small>
      )}
      <div className="flex gap-3 border-t border-[#E4E7EC] p-4 pb-[6px]">
        {noAvailableDates ? (
          <Link href="/#contact" className="w-full">
            <Button className="w-full">Contact Us</Button>
          </Link>
        ) : (
          <Button
            className="w-full"
            variant="destructive"
            onClick={handleApply}
            disabled={!selectedDate}
          >
            Apply
          </Button>
        )}
        {hasError.hasError && (
          <Button
            variant="outline"
            className="w-full border-red-500 !text-red-500"
            onClick={() => {
              setHasError({
                hasError: true,
                retry: Math.random(),
              });
            }}
          >
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}

export default BookingDate;
