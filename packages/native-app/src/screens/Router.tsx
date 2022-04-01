import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer, Theme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";

import GameList from "./GameList";
import Settings from "./Settings";
import { Button } from "react-native";
import { useTheme } from "../hooks";
import Login from "./Login";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectors } from "@diplicity/common";
import CreateGame from "./CreateGame";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Router = () => {
  const theme = useTheme();
  const loggedIn = useAppSelector(selectors.selectIsLoggedIn);
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
    <>
      {loggedIn ? (
        <NavigationContainer theme={navigationTheme}>
          <Drawer.Navigator>
            <Drawer.Screen
              name="Games"
              component={GameList}
              options={screenOptions}
            />
            <Drawer.Screen
              name="Create Game"
              component={CreateGame}
              options={screenOptions}
            />
            <Drawer.Screen
              name="Settings"
              component={Settings}
              options={screenOptions}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Router;
