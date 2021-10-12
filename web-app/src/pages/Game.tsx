import React from "react";
import useRegisterPageView from "../hooks/useRegisterPageview";

interface GameUrlParams {
  gameId: string;
}

const Game = () => {
  useRegisterPageView("Game");
}

export default Game;