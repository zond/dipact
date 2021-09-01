import { createSlice } from "@reduxjs/toolkit";
import { Messaging } from "./types";

const getDeviceId = (): string => {
	const wrapper = { getDeviceId: () => null };
	let deviceId: string;
	if (wrapper && wrapper.getDeviceId) {
		deviceId = "Wrapper/DeviceID/" + wrapper.getDeviceId();
	} else if (wrapper) {
		deviceId = "Wrapper/Static";
	} else {
		deviceId =
			localStorage.getItem("deviceID") ||
			"Browser/Random/" + new Date().getTime() + "_" + Math.random();
		localStorage.setItem("deviceID", deviceId);
	}
    return deviceId;
};

const initialState: Messaging = {
	hasPermission: "unknown",
	hasToken: false,
	targetState: "undefined",
	token: null,
	tokenApp: "dipact-v1@" + getDeviceId(),
	tokenEnabled: false,
	tokenOnServer: false,
};
const messagingSlice = createSlice({
	name: "messagingSlice",
	initialState,
    // TODO set global token
	reducers: {},
});

export const actions = messagingSlice.actions;

export default messagingSlice.reducer;
