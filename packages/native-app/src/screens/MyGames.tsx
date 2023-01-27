import React, { useState } from "react";
import { GameStatus, selectors, translateKeys as tk } from "@diplicity/common";
import GameList from "../components/GameList";
import { useTranslation } from "react-i18next";
import { BottomSheet } from "@rneui/base";

const MyGames = ({ }) => {
  const { t } = useTranslation();

  return (
    <>
      <GameList filters={{ my: true, status: GameStatus.Started, mastered: false }} />
    </>
  );
};

export default MyGames;
