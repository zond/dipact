import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer, Theme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
	createDrawerNavigator,
	DrawerNavigationOptions,
} from "@react-navigation/drawer";

import Home from "./Home";
import About from "./About";
import Settings from "./Settings";
import { Button } from "react-native";
import { useTheme } from "../hooks";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Router = () => {
	const theme = useTheme();
	const navigationTheme: Theme = {
		dark: false,
		colors: {
			primary: theme.palette.primary.main,
			background: theme.palette.background.main,
			text: theme.palette.text.main,
			border: theme.palette.border.main,
			notification: theme.palette.notification.main,
			card: theme.palette.paper.main,
		},
	};

	const screenOptions: DrawerNavigationOptions = {
		headerTintColor: theme.palette.secondary.main,
    headerStyle: {
      backgroundColor: theme.palette.primary.main,
    },
	};
	return (
		<NavigationContainer theme={navigationTheme}>
			<Drawer.Navigator>
				<Drawer.Screen name="Home" component={Home} options={screenOptions} />
				<Drawer.Screen
					name="About"
					component={About}
					options={screenOptions}
				/>
				<Drawer.Screen
					name="Settings"
					component={Settings}
					options={screenOptions}
				/>
			</Drawer.Navigator>
		</NavigationContainer>
	);
};

export default Router;
