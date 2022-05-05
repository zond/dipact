import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
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

export type RootStackParamList = {
  Home: undefined;
  GameDetail: { gameId: string; name: string };
  Game: { gameId: string };
};

const useHeaderStyleOptions = () => {
  const theme = useTheme();
  return {
    headerTintColor: theme.palette.secondary.main,
    headerStyle: {
      backgroundColor: theme.palette.primary.main,
    },
  };
};

const useNavigationTheme = () => {
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
  const screenOptions = useHeaderStyleOptions();
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name={t(tk.gameList.myGamesTab.label)}
        component={MyGames}
        options={screenOptions}
      />
      <Drawer.Screen
        name={t(tk.gameList.allGamesTab.label)}
        component={BrowseGames}
        options={screenOptions}
      />
      <Drawer.Screen
        name={t(tk.createGame.title)}
        component={CreateGame}
        options={screenOptions}
      />
    </Drawer.Navigator>
  );
};

const Game = () => {
  const options = {
    headerShown: false,
  };
  // TODO translations
  const { gameId } = useParams<"Game">();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Map" options={options}>
        {() => <Map gameId={gameId} />}
      </Tab.Screen>
      <Tab.Screen name="Chat" options={options}>
        {() => <Chat gameId={gameId} />}
      </Tab.Screen>
      <Tab.Screen name="Orders" options={options}>
        {() => <Orders gameId={gameId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const Router = () => {
  const loggedIn = useAppSelector(selectors.selectIsLoggedIn);
  const screenOptions = useHeaderStyleOptions();
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
