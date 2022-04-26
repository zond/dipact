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
import React from "react";
import useSearchParams from "../hooks/useSearchParams";
import { ArrowDownwardIcon, ArrowUpwardIcon } from "../icons";
import { useTranslation } from "react-i18next";
import { translateKeys as tk } from "@diplicity/common";
import useNationPreferencesDialog from "../hooks/useNationPreferencesDialog";

export const searchKey = "nation-preference-dialog";

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
  const { preferences, updateOrder } = useNationPreferencesDialog(variantName);

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
                        title="Move down"
                      >
                        <ArrowDownwardIcon />
                      </IconButton>
                    </Grid>
                    <Grid key={nation + "_up"} item xs={1}>
                      <IconButton
                        onClick={() => updateOrder("up", idx)}
                        disabled={!(idx > 0)}
                        title="Move up"
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
