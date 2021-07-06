import { createSlice } from "@reduxjs/toolkit";
import { diplicityService } from "./service";
import { UserConfig } from "./types";

const initialState: UserConfig & { loaded: boolean } = { loaded: false };
const userConfigSlice = createSlice({
  name: "userConfigSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      diplicityService.endpoints.getUserConfig.matchFulfilled,
      (state, { payload }) => {
        return { ...payload.Properties, loaded: true };
      }
    );
  },
});

export default userConfigSlice.reducer;
