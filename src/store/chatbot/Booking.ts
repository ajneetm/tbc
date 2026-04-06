import { AvailableTimeList } from "@/app/libs/api/chatTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type BookingType = "date" | "time" | "none";
export interface BookingStateType {
  day: string;
  hour: string;
  availableDates: AvailableTimeList;
}

const initialState: BookingStateType = {
  day: "",
  hour: "",
  availableDates: {},
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    updateDay: (state, action: PayloadAction<string>) => {
      state.day = action.payload;
    },
    updateTime: (state, action: PayloadAction<string>) => {
      state.hour = action.payload;
    },
    setAvailableDates: (state, action: PayloadAction<AvailableTimeList>) => {
      state.availableDates = action.payload;
    },

    resetBooking: () => initialState,
  },
});

export const { updateDay, updateTime, resetBooking, setAvailableDates } =
  bookingSlice.actions;

export default bookingSlice.reducer;
