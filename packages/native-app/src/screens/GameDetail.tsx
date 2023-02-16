import React, { useState } from "react";
import { ScrollView, StyleProp, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { translateKeys as tk, useGameCard } from "@diplicity/common";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import { ListItem, Avatar, Icon, Divider, IconNode } from "@rneui/base";
import Loading from "../components/Loading";
import { useNavigation } from "../hooks/useNavigation";
import { useParams } from "../hooks/useParams";
import Button from "../components/Button";
import { useDrawerNavigationOptions } from "./Router";
import { Stack, StackItem } from "../components/Stack";
import { Text } from "../components/Text";
import Table, { ITable } from "../components/Table";
import Chip from "../components/Chip";
import PlayerCard from "../components/PlayerCard";
import FAB from "../components/Fab";

const Tab = createMaterialTopTabNavigator();

const useStyles = (): StyleProp<any> => {
  const theme = useTheme();
  return {
    section: {
      borderBottomColor: theme.palette.border.light,
      borderBottomWidth: 1,
    },
  };
};

const useTabBarOptions = () => {
  const theme = useTheme();
  return {
    ...useDrawerNavigationOptions(),
    tabBarStyle: { backgroundColor: theme.palette.primary.main },
    tabBarLabelStyle: { fontSize: 16 },
    tabBarActiveTintColor: theme.palette.nmr.main,
    tabBarInactiveTintColor: theme.palette.secondary.main,
  };
};

const primaryActionTitleMap = new Map<
  string,
  { title: string; iconProps: { name: string; type: string } }
>([
  [
    "join",
    {
      title: "Join",
      iconProps: {
        name: "account-plus",
        type: "material-community",
      },
    },
  ],
  [
    "leave",
    {
      title: "Leave",
      iconProps: {
        name: "cancel",
        type: "material-community",
      },
    },
  ],
]);

const GameDetail = () => {
  const theme = useTheme();
  const styles = useStyles();
  const navigation = useNavigation<"GameDetail">();
  const { gameId } = useParams<"GameDetail">();
  const { game, isLoading } = useGameCard(gameId);
  const primaryAction = {
    type: "leave",
    callback: () => alert("Join game"),
  };

  const options = useTabBarOptions();

  const gameTable: ITable[] = [
    {
      title: "Game settings",
      rows: [
        {
          iconProps: { name: "map", type: "material-community" },
          label: "Variant",
          value: "Classical",
        },
        {
          iconProps: { name: "av-timer", type: "material-community" },
          label: "Phase deadline",
          value: "1 day",
        },
        {
          iconProps: { name: "av-timer", type: "material-community" },
          label: "Build deadline",
          value: "1 day",
        },
        {
          iconProps: {
            name: "timer-sand-complete",
            type: "material-community",
          },
          label: "Game ends after",
          value: "1909",
        },
        {
          iconProps: { name: "forum", type: "material-community" },
          label: "Chat mode",
          value: "All",
        },
      ],
    },
    {
      title: "Management settings",
      rows: [
        {
          iconProps: { name: "gavel", type: "material-community" },
          label: "Game master",
          value: "Joren",
        },
        {
          iconProps: { name: "playlist-check", type: "material-community" },
          label: "Nation selection",
          value: "Assigned by Game Master",
        },
        {
          iconProps: { name: "lock", type: "material-community" },
          label: "Visibility",
          value: "Public",
        },
      ],
    },
    {
      title: "Player settings",
      rows: [
        {
          iconProps: {
            name: "clipboard-check-multiple",
            type: "material-community",
          },
          label: "Min. commitment",
          value: () => <Chip title={"Commited+"} variant="success" />,
        },
        {
          iconProps: {
            name: "medal",
            type: "material-community",
          },
          label: "Rank",
          value: undefined,
        },
        {
          iconProps: undefined,
          label: "Min. rank",
          value: "Private First Class",
        },
        {
          iconProps: undefined,
          label: "Max. rank",
          value: "General",
        },
        {
          iconProps: {
            name: "incognito",
            type: "material-community",
          },
          label: "Player identity",
          value: "Anonymous",
        },
        {
          iconProps: {
            name: "translate",
            type: "material-community",
          },
          label: "Chat language",
          value: "Mandarin Chinese",
        },
      ],
    },
    {
      title: "Game log",
      rows: [
        {
          iconProps: {
            name: "map",
            type: "material-community",
          },
          label: "Created",
          value: "10/20/2012",
        },
        {
          iconProps: {
            name: "map",
            type: "material-community",
          },
          label: "Started",
          value: "10/20/2012",
        },
        {
          iconProps: {
            name: "map",
            type: "material-community",
          },
          label: "Finished",
          value: "10/20/2012",
        },
      ],
    },
  ];

  const variantTable: ITable[] = [
    {
      title: "Variant details",
      rows: [
        {
          label: "Name",
          value: "Classical",
          iconProps: { name: "map", type: "material-community" },
        },
        {
          label: "Rules",
          value:
            "The first to 18 Supply Centers (SC) is the winner. Kiel and Constantinople have a canal, so fleets can exit on either side. Armies can move from Denmark to Kiel.",
          iconProps: { name: "book-open-variant", type: "material-community" },
          orientation: "vertical",
        },
        {
          label: "Players",
          value: "7",
          iconProps: { name: "account-group", type: "material-community" },
        },
        {
          label: "Solo win condition",
          value: "18 supply centers",
          iconProps: { name: "trophy", type: "material-community" },
        },
        {
          label: "Start year",
          value: "1901",
          iconProps: { name: "fountain-pen-tip", type: "material-community" },
        },
      ],
    },
  ];

  return (
    <>
      <Tab.Navigator>
        <Tab.Screen
          name="GameInfo"
          options={{
            ...options,
            title: "Game",
          }}
        >
          {() => (
            <ScrollView>
              <Stack padding={1}>
                <Text variant="title" bold>
                  {game?.name}
                </Text>
              </Stack>
              <Stack orientation="vertical" gap={1}>
                {gameTable.map(({ title, rows }) => (
                  <Table
                    title={title}
                    rows={rows}
                    tableStyle={styles.section}
                    key={title}
                  />
                ))}
              </Stack>
            </ScrollView>
          )}
        </Tab.Screen>
        <Tab.Screen
          name="PlayerInfo"
          options={{
            ...options,
            title: "Players",
          }}
        >
          {() => (
            <ScrollView>
              <Stack padding={1}>
                <Text variant="sectionTitle" bold>
                  Players
                </Text>
              </Stack>
              <Stack orientation="vertical">
                {game?.players.map(({ username, image }) => (
                  <PlayerCard
                    username={username}
                    src={image}
                    variant="compact"
                    numPlayedGames={1}
                    numWonGames={1}
                    numDrawnGames={1}
                    numAbandonedGames={1}
                    reliabilityLabel={"commited"}
                    reliabilityRating={0.5}
                    style={styles.section}
                    key={username}
                  />
                ))}
              </Stack>
            </ScrollView>
          )}
        </Tab.Screen>
        <Tab.Screen
          name="VariantInfo"
          options={{
            ...options,
            title: "Variant",
          }}
        >
          {() => (
            <ScrollView>
              <Stack padding={1}>
                <Text variant="sectionTitle" bold>
                  Variant details
                </Text>
              </Stack>
              <Stack orientation="vertical" gap={1}>
                {variantTable.map(({ rows }) => (
                  <Table rows={rows} tableStyle={styles.section} />
                ))}
              </Stack>
            </ScrollView>
          )}
        </Tab.Screen>
      </Tab.Navigator>
      <FAB
        icon={{
          ...(primaryActionTitleMap.get(primaryAction.type)?.iconProps ?? {}),
          color: theme.palette.secondary.main,
        }}
        title={primaryActionTitleMap.get(primaryAction.type)?.title}
        onPress={primaryAction.callback}
      />
    </>
  );
};

export default GameDetail;
