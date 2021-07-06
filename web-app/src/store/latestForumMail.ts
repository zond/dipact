import { createSlice } from "@reduxjs/toolkit";
import { diplicityService } from "./service";
import { ForumMail } from "./types";

const initialState: ForumMail = {};
const latestForumMailSlice = createSlice({
  name: "latestForumMailSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      diplicityService.endpoints.getForumMail.matchFulfilled,
      (state, { payload }) => {
        return payload.Properties;
      }
    );
  },
});

export default latestForumMailSlice.reducer;
