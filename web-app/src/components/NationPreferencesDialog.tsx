import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Paper,
  List,
  ListItem,
  Grid,
  IconButton,
  DialogActions,
  Button,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useSelectVariant } from "../hooks/selectors";
import {
  useJoinGameMutation,
  useLazyGetGameQuery,
  useListVariantsQuery,
} from "../hooks/service";
import { registerEvent, registerPageView } from "../hooks/useRegisterPageview";
import useSearchParams from "../hooks/useSearchParams";
import { ArrowDownwardIcon, ArrowUpwardIcon } from "../icons";

export const searchKey = "nation-preference-dialog";

const NATION_PREFERENCES_DIALOG_TITLE = "Nation preferences";
const NATION_PREFERENCES_DIALOG_PROMPT =
  "Sort the possible nations in order of preference.";
const JOIN_BUTTON_LABEL = "Join";
const CANCEL_BUTTON_LABEL = "Cancel";

const NationPreferencesDialog = (): React.ReactElement => {
  const { getParam, removeParam } = useSearchParams();
  const gameId = getParam(searchKey);
  const [sortedNations, setSortedNations] = useState<string[]>([]);
  const open = Boolean(gameId);

  // TODO refactor into hook
  const [joinGame, { isLoading, isSuccess }] = useJoinGameMutation();

  useListVariantsQuery(undefined);

  const [
    getGameTrigger,
    {
      data: game,
    },
  ] = useLazyGetGameQuery();

  const variant = useSelectVariant(game?.Variant || "");
  const nations = variant?.Nations;

  const close = useCallback(() => {
    removeParam(searchKey);
  }, [removeParam]);

  useEffect(() => {
    if (gameId) registerPageView("NationPreferencesDialog");
    if (gameId) getGameTrigger(gameId);
  }, [gameId, getGameTrigger]);

  useEffect(() => {
    if (!sortedNations.length && nations?.length)
      setSortedNations(nations as string[]);
  }, [nations, sortedNations.length]);

  useEffect(() => {
    if (isSuccess) {
      registerEvent("game_list_element_join");
      close();
    }
  }, [close, isSuccess]);

  const onSelected = () => {
    joinGame({
      gameId: gameId as string,
      NationPreferences: sortedNations.join(","),
      GameAlias: "",
    });
  };

  const updateOrder = (direction: "up" | "down", idx: number) => {
    const nextIdx = direction === "down" ? idx + 1 : idx - 1;
    let tmpNations = sortedNations.slice();
    let tmp = sortedNations[nextIdx];
    tmpNations[nextIdx] = sortedNations[idx];
    tmpNations[idx] = tmp;
    setSortedNations(tmpNations);
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>{NATION_PREFERENCES_DIALOG_TITLE}</DialogTitle>
      <DialogContent>
        <Typography>{NATION_PREFERENCES_DIALOG_PROMPT}</Typography>
        <Paper elevation={3}>
          <List>
            {sortedNations.map((nation, idx) => {
              return (
                <ListItem key={nation}>
                  <Grid container>
                    <Grid key={nation} item xs={10}>
                      <Typography>{nation}</Typography>
                    </Grid>
                    <Grid key={nation + "_down"} item xs={1}>
                      <IconButton
                        onClick={() => updateOrder("down", idx)}
                        disabled={!(idx < sortedNations.length - 1)}
                      >
                        <ArrowDownwardIcon />
                      </IconButton>
                    </Grid>
                    <Grid key={nation + "_up"} item xs={1}>
                      <IconButton
                        onClick={() => updateOrder("up", idx)}
                        disabled={!(idx > 0)}
                      >
                        <ArrowUpwardIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })}
          </List>
        </Paper>
        <DialogActions>
          <Button onClick={close}>{CANCEL_BUTTON_LABEL}</Button>
          <Button onClick={onSelected} disabled={isLoading}>
            {JOIN_BUTTON_LABEL}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default NationPreferencesDialog;
