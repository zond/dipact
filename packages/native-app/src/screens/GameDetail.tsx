import React, { useState } from "react";
import { ScrollView, StyleProp, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { translateKeys as tk, useGameCard } from "@diplicity/common";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import { ListItem, Avatar, Icon, Divider } from "@rneui/base";
import Loading from "../components/Loading";
import { useNavigation } from "../hooks/useNavigation";
import { useParams } from "../hooks/useParams";
import Button from "../components/Button";
import { useDrawerNavigationOptions } from "./Router";
import { Stack, StackItem } from "../components/Stack";
import { Text } from "../components/Text";
import Table from "../components/Table";
import Chip from "../components/Chip";

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

const GameDetail = () => {
  const theme = useTheme();
  const styles = useStyles();
  const navigation = useNavigation<"GameDetail">();
  const { gameId } = useParams<"GameDetail">();
  const { game, isLoading } = useGameCard(gameId);

  const options = useTabBarOptions();

  const table = [
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

  return (
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
              {table.map(({ title, rows }) => (
                <Table title={title} rows={rows} tableStyle={styles.section} />
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
          <Stack>
            <Text>Players</Text>
          </Stack>
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
          <Stack>
            <Text>Variant</Text>
          </Stack>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );

  // return (
  //   <ScrollView contentContainerStyle={styles.rootContainer}>
  //     {isLoading ? (
  //       <Loading size={"large"} />
  //     ) : (
  //       game && (
  //         <View style={styles.container}>
  //           <View>
  //             <ListItem.Accordion
  //               isExpanded={rulesAccordionExpanded}
  //               onPress={() =>
  //                 setRulesAccordionExpanded(!rulesAccordionExpanded)
  //               }
  //               content={
  //                 <ListItem.Content>
  //                   <ListItem.Title style={styles.sectionTitle}>
  //                     {t(tk.gameList.gameCard.rules.label)}
  //                   </ListItem.Title>
  //                 </ListItem.Content>
  //               }
  //               bottomDivider
  //             >
  //               {Boolean(game.chatLanguage) && (
  //                 <ListItem containerStyle={styles.listItem}>
  //                   <Icon name="chat" />
  //                   <Text>{game.chatLanguage}</Text>
  //                 </ListItem>
  //               )}
  //               {Boolean(game.chatLanguageDisplay) && (
  //                 <ListItem containerStyle={styles.listItem}>
  //                   <Icon name="chat" />
  //                   <Text>
  //                     {t(tk.gameList.gameCard.chatLanguageRule.label, {
  //                       language: game.chatLanguageDisplay,
  //                     })}
  //                   </Text>
  //                 </ListItem>
  //               )}
  //               <ListItem containerStyle={styles.listItem}>
  //                 <Icon name="map" />
  //                 <Text>
  //                   {t(tk.gameList.gameCard.gameVariantRule.label, {
  //                     variant: game.gameVariant,
  //                   })}
  //                 </Text>
  //               </ListItem>
  //               <ListItem containerStyle={styles.listItem}>
  //                 <Icon name="timer" />
  //                 <Text>
  //                   {t(tk.gameList.gameCard.phaseDeadlineRule.label, {
  //                     deadline: game.deadlineDisplay,
  //                   })}
  //                 </Text>
  //               </ListItem>
  //               <ListItem containerStyle={styles.listItem}>
  //                 <Icon name="timer" />
  //                 <Text>
  //                   {t(tk.gameList.gameCard.createdAtRule.label, {
  //                     createdAt: game.createdAtDisplay,
  //                   })}
  //                 </Text>
  //               </ListItem>
  //               <ListItem containerStyle={styles.listItem}>
  //                 <Icon name="flag" />
  //                 <Text>
  //                   {t(tk.gameList.gameCard.nationAllocationRule.label, {
  //                     nationAllocation: game.nationAllocation,
  //                   })}
  //                 </Text>
  //               </ListItem>
  //             </ListItem.Accordion>
  //             <ListItem.Accordion
  //               isExpanded={playersAccordionExpanded}
  //               onPress={() =>
  //                 setPlayersAccordionExpanded(!playersAccordionExpanded)
  //               }
  //               content={
  //                 <ListItem.Content>
  //                   <ListItem.Title style={styles.sectionTitle}>
  //                     {t(tk.gameList.gameCard.players.label)}
  //                   </ListItem.Title>
  //                 </ListItem.Content>
  //               }
  //               bottomDivider
  //             >
  //               <View style={styles.players}>
  //                 {game.players.map(({ username, image }) => (
  //                   <ListItem key={username} containerStyle={styles.listItem}>
  //                     <Avatar source={{ uri: image }} rounded />
  //                     <Text>{username}</Text>
  //                   </ListItem>
  //                 ))}
  //               </View>
  //             </ListItem.Accordion>
  //             {/* <View>
  //               {Boolean(game.failedRequirements.length) && (
  //                 <Text>
  //                   {t(tk.gameList.gameCard.failedRequirements.label)}
  //                 </Text>
  //               )}
  //               <View>
  //                 {game.failedRequirements.map((req) => (
  //                   <ListItem key={req}>
  //                     <Text>{t(failedRequirementExplanationMap[req])}</Text>
  //                   </ListItem>
  //                 ))}
  //               </View>
  //             </View> */}
  //           </View>
  //           <View style={styles.buttons}>
  //             <Button
  //               onPress={onPressView}
  //               title={t(tk.gameList.gameCard.viewButton.label)}
  //               accessibilityLabel={t(tk.gameList.gameCard.viewButton.label)}
  //               iconProps={{ name: "eye" }}
  //             />
  //           </View>
  //         </View>
  //       )
  //     )}
  //   </ScrollView>
  // );
};

export default GameDetail;
