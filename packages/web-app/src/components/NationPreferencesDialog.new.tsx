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
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import useSearchParams from "../hooks/useSearchParams";
import { useLazyPageLoad } from "../hooks/usePageLoad";
import { ArrowDownwardIcon, ArrowUpwardIcon } from "../icons";
import { useTranslation } from "react-i18next";
import {
  diplicityService,
  PageName,
  selectors,
  translateKeys as tk,
} from "@diplicity/common";
import { useAppSelector } from "../hooks/useAppSelector";
import { RootState } from "../store";

const { useListVariantsQuery } = diplicityService;

export const searchKey = "nation-preference-dialog";

// TODO move to common
// TODO use viewSelector
const useNationPeferencesDialog = (variantName: string | null) => {
  useListVariantsQuery(undefined);
  const [preferences, setPreferences] = useState<string[]>([]);
  const triggerPageLoad = useLazyPageLoad(PageName.NationPreferencesDialog);

  const { nations } = useAppSelector((state: RootState) =>
    selectors.selectNationPreferencesDialogView(state, variantName || "")
  );

  useEffect(() => {
    if (variantName) triggerPageLoad();
  }, [variantName, triggerPageLoad]);

  useEffect(() => {
    if (!preferences.length && nations.length)
      setPreferences(nations as string[]);
  }, [nations, preferences.length]);

  const updateOrder = (direction: "up" | "down", idx: number) => {
    const nextIdx = direction === "down" ? idx + 1 : idx - 1;
    let tmpNations = preferences.slice();
    let tmp = preferences[nextIdx];
    tmpNations[nextIdx] = preferences[idx];
    tmpNations[idx] = tmp;
    setPreferences(tmpNations);
  };

  return {
    preferences,
    updateOrder,
  };
};

interface NationPreferenceDialogProps {
  handleSubmit: (preferences: string[]) => void;
}

const NationPreferencesDialog = ({
  handleSubmit,
}: NationPreferenceDialogProps): React.ReactElement => {
  const { t } = useTranslation();
  const { getParam, removeParam } = useSearchParams();
  const close = () => removeParam(searchKey);
  const variantName = getParam(searchKey);
  const { preferences, updateOrder } = useNationPeferencesDialog(variantName);

  const onClickSubmit = () => {
    handleSubmit(preferences);
    close();
  };

  return (
    <Dialog open={Boolean(variantName)} onClose={close}>
      <DialogTitle>{t(tk.nationPreferences.title)}</DialogTitle>
      <DialogContent>
        <Typography>{t(tk.nationPreferences.prompt)}</Typography>
        <Paper elevation={3}>
          <List>
            {preferences.map((nation, idx) => {
              return (
                <ListItem key={nation}>
                  <Grid container>
                    <Grid key={nation} item xs={10}>
                      <Typography>{nation}</Typography>
                    </Grid>
                    <Grid key={nation + "_down"} item xs={1}>
                      <IconButton
                        onClick={() => updateOrder("down", idx)}
                        disabled={!(idx < preferences.length - 1)}
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
          <Button onClick={onClickSubmit}>
            {t(tk.nationPreferences.joinButton.label)}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default NationPreferencesDialog;
