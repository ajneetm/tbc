export type TimeRange = {
  from: string;
  to: string;
};

export type AvailableTimeList = {
  [date: string]: TimeRange[];
};

export type BookingHourPayload = {
  book_date: string;
  book_from: string;
  book_to: string;
};

