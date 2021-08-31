import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import StatsDialog from "./StatsDialog";

const initialValues = { open: () => {}, close: () => {} };

export const StatsDialogContext =
  React.createContext<StatsDialogOptions>(initialValues);

interface StatsDialogContextWrapperProps extends RouteComponentProps {
  children: React.ReactNode;
}

interface StatsDialogOptions {
  open: (user: any, game: any, gameState: any, onNewGameState: any) => void;
  close: () => void;
}

export type WithStatsDialogProps = {
  statsDialogOptions: StatsDialogOptions;
};

export interface StatsDialogComponentProps {
  statsDialogOptions: StatsDialogOptions;
}

export function withStatsDialog<P>(
  WrappedComponent: React.ComponentType<P & WithStatsDialogProps>
) {
  const ComponentWithStatsDialog = (
    props: P
  ): React.ReactElement<P & WithStatsDialogProps> => (
    <StatsDialogContext.Consumer>
      {(statsDialog) => (
        <WrappedComponent {...props} statsDialogOptions={statsDialog} />
      )}
    </StatsDialogContext.Consumer>
  );
  return ComponentWithStatsDialog;
}

const StatsDialogContextWrapper = ({
  children,
  location,
}: StatsDialogContextWrapperProps): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  // TODO simplify props
  const [game, setGame] = useState(undefined);
  const [gameState, setGameState] = useState(undefined);
  const [onNewGameState, setOnNewGameState] = useState(undefined);

  const close = (): void => {
    setIsOpen(false);
    setUser(null);
    setGame(undefined);
    setGameState(undefined);
    setOnNewGameState(undefined);
  };

  const open = (user: any, game: any, gameState: any, onNewGameState: any): void => {
    setUser(user);
    setGame(game);
    setGameState(gameState);
    setOnNewGameState(onNewGameState);
    setIsOpen(true);
  };

  const statsDialogOptions: StatsDialogOptions = { open, close };

  return (
    <StatsDialogContext.Provider value={statsDialogOptions}>
      {isOpen && (
        <StatsDialog
          open={isOpen}
          user={user}
          onClose={close}
          game={game}
          gameState={gameState}
          onNewGameState={onNewGameState}
        />
      )}
      {children}
    </StatsDialogContext.Provider>
  );
};

export default withRouter(StatsDialogContextWrapper);
