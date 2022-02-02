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
import React, { useEffect, useState } from "react";
import { useSelectVariant } from "../hooks/selectors";
import {
  useJoinGameMutation,
  useLazyGetGameQuery,
  useListVariantsQuery,
} from "../hooks/service";
import { registerEvent, registerPageView } from "../hooks/useRegisterPageview";
import useSearchParams from "../hooks/useSearchParams";
import { ArrowDownwardIcon, ArrowUpwardIcon } from "../icons";
import { useTranslation } from "react-i18next";
import tk from "../translations/translateKeys";

export const searchKey = "nation-preference-dialog";

const NationPreferencesDialog = (): React.ReactElement => {
  const { t } = useTranslation("common");
  const { getParam, removeParam } = useSearchParams();
  const gameId = getParam(searchKey);
  const [sortedNations, setSortedNations] = useState<string[]>([]);
  const open = Boolean(gameId);

  // TODO refactor into hook
  const [joinGame, { isLoading, isSuccess }] = useJoinGameMutation();

  useListVariantsQuery(undefined);

  const [getGameTrigger, { data: game }] = useLazyGetGameQuery();

  const variant = useSelectVariant(game?.Variant || "");
  const nations = variant?.Nations;

  const close = () => {
    removeParam(searchKey);
  };

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
    }
  }, [isSuccess, removeParam]);

  const onSelected = () => {
    joinGame({
      gameId: gameId as string,
      NationPreferences: sortedNations.join(","),
      GameAlias: "",
    });
    removeParam(searchKey);
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
      <DialogTitle>{t(tk.nationPreferences.title)}</DialogTitle>
      <DialogContent>
        <Typography>{t(tk.nationPreferences.prompt)}</Typography>
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
          <Button onClick={close}>
            {t(tk.nationPreferences.closeButton.label)}
          </Button>
          <Button onClick={onSelected} disabled={isLoading}>
            {t(tk.nationPreferences.joinButton.label)}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default NationPreferencesDialog;
