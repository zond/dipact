import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MyGames from "./MyGames";
import { useTheme } from "../hooks/useTheme";
import Login from "./Login";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectors, translateKeys as tk } from "@diplicity/common";
import CreateGame from "./CreateGame";
import { useTranslation } from "react-i18next";
import GameDetail from "./GameDetail";
import BrowseGames from "./BrowseGames";
import Map from "./Map";
import Chat from "./Chat";
import Orders from "./Orders";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useParams } from "../hooks/useParams";
import { Icon } from "@rneui/base";

export type RootStackParamList = {
  Home: undefined;
  GameDetail: { gameId: string; name: string };
  Game: { gameId: string };
};

export const useDrawerNavigationOptions = () => {
  const theme = useTheme();
  return {
    headerTintColor: theme.palette.secondary.main,
    headerStyle: {
      backgroundColor: theme.palette.primary.main,
    },
  };
};

export const useNavigationTheme = () => {
  const theme = useTheme();
  return {
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
};

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const Home = () => {
  const { t } = useTranslation();
  const drawerNavigationOptions = useDrawerNavigationOptions();
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name={t(tk.gameList.myGamesTab.label)}
        component={MyGames}
        options={drawerNavigationOptions}
      />
      <Drawer.Screen
        name={t(tk.gameList.allGamesTab.label)}
        component={BrowseGames}
        options={drawerNavigationOptions}
      />
      <Drawer.Screen
        name={t(tk.createGame.title)}
        component={CreateGame}
        options={drawerNavigationOptions}
      />
    </Drawer.Navigator>
  );
};

const Game = () => {
  // TODO translations
  const { gameId } = useParams<"Game">();
  const screenOptions = useDrawerNavigationOptions();
  const theme = useTheme();
  const options = {
    title: "",
    ...screenOptions,
    tabBarActiveBackgroundColor: theme.palette.primary.main,
    tabBarActiveTintColor: theme.palette.secondary.main,
  };
  const getIconColor = (focused: boolean) =>
    focused ? theme.palette.secondary.main : theme.palette.primary.main;
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Map"
        options={{
          ...options,
          tabBarIcon: ({ focused }) => (
            // TODO use outlined and non-outlined for active inactive
            <Icon name="map" color={getIconColor(focused)} />
          ),
          title: "Map",
        }}
      >
        {() => <Map gameId={gameId} />}
      </Tab.Screen>
      <Tab.Screen
        name="Chat"
        options={{
          ...options,
          tabBarIcon: ({ focused }) => (
            <Icon name="chat" color={getIconColor(focused)} />
          ),
          title: "Chat",
        }}
      >
        {() => <Chat gameId={gameId} />}
      </Tab.Screen>
      <Tab.Screen
        name="Orders"
        options={{
          ...options,
          tabBarIcon: ({ focused }) => (
            <Icon name="article" color={getIconColor(focused)} />
          ),
          title: "Orders",
        }}
      >
        {() => <Orders gameId={gameId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const Router = () => {
  const loggedIn = useAppSelector(selectors.selectIsLoggedIn);
  const screenOptions = useDrawerNavigationOptions();
  const navigationTheme = useNavigationTheme();

  return (
    <>
      {loggedIn ? (
        <NavigationContainer theme={navigationTheme}>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="GameDetail"
              component={GameDetail}
              initialParams={{ gameId: undefined }}
              options={({ route }) => ({
                title: route.params.name,
                ...screenOptions,
              })}
            />
            <Stack.Screen
              name="Game"
              component={Game}
              initialParams={{ gameId: undefined }}
              options={{
                headerTransparent: true,
                title: "",
                ...screenOptions,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Router;
