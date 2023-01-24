import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { GameStatus, selectors, translateKeys as tk } from "@diplicity/common";
import GameList from "../components/GameList";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../hooks/useAppSelector";

const MyGames = ({}) => {
  const { t } = useTranslation();

  return (
    <ScrollView>
      <GameList
        title={t(tk.gameList.gameStatusLabels.started)}
        filters={{ my: true, status: GameStatus.Started, mastered: false }}
      />
      <GameList
        title={t(tk.gameList.gameStatusLabels.staging)}
        filters={{ my: true, status: GameStatus.Staging, mastered: false }}
      />
      <GameList
        title={t(tk.gameList.gameStatusLabels.finished)}
        filters={{ my: true, status: GameStatus.Finished, mastered: false }}
        startClosed
      />
    </ScrollView>
  );
};

export default MyGames;
