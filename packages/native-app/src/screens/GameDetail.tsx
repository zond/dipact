import React, { useState } from "react";
import { ScrollView, StyleProp, Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { translateKeys as tk, useGameCard } from "@diplicity/common";
import { useTranslation } from "react-i18next";
import { ListItem, Avatar, Icon } from "@rneui/base";
import Loading from "../components/Loading";
import { useNavigation } from "../hooks/useNavigation";
import { useParams } from "../hooks/useParams";
import Button from "../components/Button";

const useStyles = (): StyleProp<any> => {
  const theme = useTheme();
  return {
    rootContainer: {
      flexGrow: 1,
    },
    container: {
      flexGrow: 1,
      flex: 1,
      justifyContent: "space-between",
    },
    buttons: {
      padding: theme.spacing(2),
      display: "flex",
      flexDirection: "row-reverse",
      width: "100%",
      justifyContent: "flex-start",
    },
    button: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
    },
    buttonContainer: {
      marginLeft: theme.spacing(1),
    },
    buttonTitle: {
      color: theme.palette.secondary.main,
    },
    name: {
      fontSize: 16,
      padding: theme.spacing(1),
      fontWeight: "bold",
      color: theme.palette.secondary.main,
    },
    sectionTitle: {
      fontWeight: "bold",
    },
    listItem: {
      padding: theme.spacing(1),
      width: "100%",
    },
  };
};

const GameDetail = () => {
  const navigation = useNavigation<"GameDetail">();
  const { gameId } = useParams<"GameDetail">();
  const { t } = useTranslation();
  const [rulesAccordionExpanded, setRulesAccordionExpanded] = useState(false);
  const [playersAccordionExpanded, setPlayersAccordionExpanded] =
    useState(false);
  const styles = useStyles();
  const { game, isLoading, joinGame } = useGameCard(gameId);

  const onPressView = () => {
    navigation.navigate("Game", { gameId });
  };

  return (
    <ScrollView contentContainerStyle={styles.rootContainer}>
      {isLoading ? (
        <Loading size={"large"} />
      ) : (
        game && (
          <View style={styles.container}>
            <View>
              <ListItem.Accordion
                isExpanded={rulesAccordionExpanded}
                onPress={() =>
                  setRulesAccordionExpanded(!rulesAccordionExpanded)
                }
                content={
                  <ListItem.Content>
                    <ListItem.Title style={styles.sectionTitle}>
                      {t(tk.gameList.gameCard.rules.label)}
                    </ListItem.Title>
                  </ListItem.Content>
                }
                bottomDivider
              >
                {Boolean(game.chatLanguage) && (
                  <ListItem containerStyle={styles.listItem}>
                    <Icon name="chat" />
                    <Text>{game.chatLanguage}</Text>
                  </ListItem>
                )}
                {Boolean(game.chatLanguageDisplay) && (
                  <ListItem containerStyle={styles.listItem}>
                    <Icon name="chat" />
                    <Text>
                      {t(tk.gameList.gameCard.chatLanguageRule.label, {
                        language: game.chatLanguageDisplay,
                      })}
                    </Text>
                  </ListItem>
                )}
                <ListItem containerStyle={styles.listItem}>
                  <Icon name="map" />
                  <Text>
                    {t(tk.gameList.gameCard.gameVariantRule.label, {
                      variant: game.gameVariant,
                    })}
                  </Text>
                </ListItem>
                <ListItem containerStyle={styles.listItem}>
                  <Icon name="timer" />
                  <Text>
                    {t(tk.gameList.gameCard.phaseDeadlineRule.label, {
                      deadline: game.deadlineDisplay,
                    })}
                  </Text>
                </ListItem>
                <ListItem containerStyle={styles.listItem}>
                  <Icon name="timer" />
                  <Text>
                    {t(tk.gameList.gameCard.createdAtRule.label, {
                      createdAt: game.createdAtDisplay,
                    })}
                  </Text>
                </ListItem>
                <ListItem containerStyle={styles.listItem}>
                  <Icon name="flag" />
                  <Text>
                    {t(tk.gameList.gameCard.nationAllocationRule.label, {
                      nationAllocation: game.nationAllocation,
                    })}
                  </Text>
                </ListItem>
              </ListItem.Accordion>
              <ListItem.Accordion
                isExpanded={playersAccordionExpanded}
                onPress={() =>
                  setPlayersAccordionExpanded(!playersAccordionExpanded)
                }
                content={
                  <ListItem.Content>
                    <ListItem.Title style={styles.sectionTitle}>
                      {t(tk.gameList.gameCard.players.label)}
                    </ListItem.Title>
                  </ListItem.Content>
                }
                bottomDivider
              >
                <View style={styles.players}>
                  {game.players.map(({ username, image }) => (
                    <ListItem key={username} containerStyle={styles.listItem}>
                      <Avatar source={{ uri: image }} rounded />
                      <Text>{username}</Text>
                    </ListItem>
                  ))}
                </View>
              </ListItem.Accordion>
              <View>
                {Boolean(game.failedRequirements.length) && (
                  <Text>
                    {t(tk.gameList.gameCard.failedRequirements.label)}
                  </Text>
                )}
                <View>
                  {game.failedRequirements.map((req) => (
                    <ListItem key={req}>
                      {/* <Text>{t(failedRequirementExplanationMap[req])}</Text> */}
                    </ListItem>
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.buttons}>
              <Button
                onPress={onPressView}
                title={t(tk.gameList.gameCard.viewButton.label)}
                iconProps={{ name: "eye" }}
              />
              <Button
                onPress={() => joinGame()}
                title={t(tk.gameList.gameCard.joinButton.label)}
                iconProps={{ name: "plus" }}
              />
            </View>
          </View>
        )
      )}
    </ScrollView>
  );
};

export default GameDetail;
