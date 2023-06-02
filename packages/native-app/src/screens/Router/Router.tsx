import * as React from "react";
import { useTranslation } from "react-i18next";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Icon } from "@rneui/base";
import {
  selectAuth,
  translateKeys as tk,
  useGameDetailView,
  useTelemetry,
} from "diplicity-common-internal";

import BrowseGames from "../BrowseGames";
import Chat from "../Chat";
import CreateGame from "../CreateGame";
import GameInfo from "../GameInfo";
import Login from "../Login";
import Map from "../Map";
import MyGames from "../MyGames";
import Orders from "../Orders";
import PlayerInfo from "../PlayerInfo";
import VariantInfo from "../VariantInfo";
import { useParams } from "../../hooks/useParams";
import { useTheme } from "../../hooks/useTheme";
import { MoreButton } from "../../components/Button";
import FAB from "../../components/Fab";
import { useSelector } from "react-redux";

export type RootStackParamList = {
  Home: undefined;
  GameDetail: { gameId: string; name: string };
  GameInfo: { gameId: string };
  PlayerInfo: { gameId: string };
  VariantInfo: { gameId: string };
  Game: { gameId: string };
};

export const useDrawerNavigationOptions = () => {
  const theme = useTheme();
  return {
    headerTintColor: theme.palette.secondary.main,
    headerStyle: {
      backgroundColor: theme.palette.primary.main,
    },
    headerTitleStyle: {
      ...(theme.typography.title as object),
      color: theme.palette.secondary.main,
    },
    drawerLabelStyle: {
      ...(theme.typography.body1 as object),
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
const TopTab = createMaterialTopTabNavigator();

const Home = () => {
  const { t } = useTranslation();
  const drawerNavigationOptions = useDrawerNavigationOptions();
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name={t(tk.gameList.myGamesTab.label)}
        component={MyGames}
        options={{
          ...drawerNavigationOptions,
        }}
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
  const { gameId } = useParams<"Game">();
  const theme = useTheme();
  const options = { ...useTabBarOptions(), tabBarShowLabel: false };
  const getIconColor = (focused: boolean) =>
    focused ? theme.palette.secondary.main : theme.palette.secondary.inactive;
  return (
    <TopTab.Navigator>
      <TopTab.Screen
        name="Map"
        options={{
          ...options,
          tabBarIcon: ({ focused }) => (
            // TODO use outlined and non-outlined for active inactive
            <Icon name="map" color={getIconColor(focused)} />
          ),
          // title: "Map",
        }}
      >
        {() => <Map gameId={gameId} />}
      </TopTab.Screen>
      <TopTab.Screen
        name="Chat"
        options={{
          ...options,
          tabBarIcon: ({ focused }) => (
            <Icon name="chat" color={getIconColor(focused)} />
          ),
          // title: "Chat",
        }}
      >
        {() => <Chat gameId={gameId} />}
      </TopTab.Screen>
      <TopTab.Screen
        name="Orders"
        options={{
          ...options,
          tabBarIcon: ({ focused }) => (
            <Icon name="article" color={getIconColor(focused)} />
          ),
          // title: "Orders",
        }}
      >
        {() => <Orders gameId={gameId} />}
      </TopTab.Screen>
    </TopTab.Navigator>
  );
};

const onPressMoreGameDetail = (gameId: string) => {
  console.log(gameId);
};

const useTabBarOptions = () => {
  const theme = useTheme();
  return {
    tabBarStyle: { backgroundColor: theme.palette.primary.main },
    tabBarLabelStyle: { fontSize: 16 },
    tabBarActiveTintColor: theme.palette.nmr.main,
    tabBarInactiveTintColor: theme.palette.secondary.main,
    headerTintColor: theme.palette.secondary.main,
    headerStyle: {
      backgroundColor: theme.palette.primary.main,
    },
    headerTitleStyle: {
      ...(theme.typography.title as object),
      color: theme.palette.secondary.main,
    },
  };
};

const GameDetail = () => {
  const { gameId } = useParams<"GameDetail">();
  const options = useTabBarOptions();
  const { actions } = useGameDetailView(gameId);
  return (
    <>
      <TopTab.Navigator>
        <TopTab.Screen
          name="GameInfo"
          initialParams={{ gameId }}
          options={{
            ...options,
            title: "Game",
          }}
        >
          {() => <GameInfo />}
        </TopTab.Screen>
        <TopTab.Screen
          name="PlayerInfo"
          initialParams={{ gameId }}
          options={{
            ...options,
            title: "Players",
          }}
        >
          {() => <PlayerInfo />}
        </TopTab.Screen>
        <TopTab.Screen
          name="VariantInfo"
          initialParams={{ gameId }}
          options={{
            ...options,
            title: "Variant",
          }}
        >
          {() => <VariantInfo />}
        </TopTab.Screen>
      </TopTab.Navigator>
      <FAB
        icon={"joinGame"}
        title={"Join"}
        onPress={actions.joinGame.call}
        disabled={actions.joinGame.mutation.isLoading}
      />
    </>
  );
};

const Router = () => {
  const theme = useTheme();
  const telemetryService = useTelemetry();
  const { loggedIn } = useSelector(selectAuth);
  const screenOptions = useDrawerNavigationOptions();
  const navigationTheme = useNavigationTheme();

  telemetryService.logInfo(`Rendering Router with loggedIn=${loggedIn}`);

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
                title: "Game details",
                ...screenOptions,
                headerRight: () => (
                  <MoreButton
                    onPress={() => onPressMoreGameDetail(route.params.gameId)}
                    iconProps={{ color: theme.palette.secondary.main }}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="Game"
              component={Game}
              initialParams={{ gameId: undefined }}
              options={({ route }) => ({
                title: "Name of the game",
                ...screenOptions,
                headerRight: () => (
                  <MoreButton
                    onPress={() => onPressMoreGameDetail(route.params.gameId)}
                    iconProps={{ color: theme.palette.secondary.main }}
                  />
                ),
              })}
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
