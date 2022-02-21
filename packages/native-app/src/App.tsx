/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import "react-native-gesture-handler";
import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "react-native-elements";

import { Colors } from "react-native/Libraries/NewAppScreen";
import Router from "./screens/Router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { theme } from "./theme";
import StorybookUI from "./storybook";

const LOAD_STORYBOOK: boolean = false;

const App = () => {
	return (
		<SafeAreaProvider>
			<ThemeProvider theme={theme}>
				<Router />
			</ThemeProvider>
		</SafeAreaProvider>
	);
};

export default LOAD_STORYBOOK ? StorybookUI : App;