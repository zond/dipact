import initStoryshots from "@storybook/addon-storyshots";

import "react-native-gesture-handler/jestSetup";

jest.useFakeTimers();

jest.mock("@react-native-community/async-storage", () => ({
    default: null,
}));

jest.mock("@react-native-community/masked-view", () => ({}));

/* Silence the warning: Animated: `useNativeDriver` is
 * not supported because the native animated module is missing
 */
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

initStoryshots({
	framework: "react-native",
	configPath: "src/storybook",
});
