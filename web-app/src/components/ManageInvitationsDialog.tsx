import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputLabel,
  TextField,
  Typography,
  Grid,
  IconButton,
  ListItem,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React, { useEffect, useState } from "react";
import { useSelectVariant } from "../hooks/selectors";
import {
  useInviteMutation,
  useLazyGetGameQuery,
  useListVariantsQuery,
  useUnInviteMutation,
} from "../hooks/service";
import { nationAllocationMap } from "@diplicity/common";
import { registerEvent, registerPageView } from "../hooks/useRegisterPageview";
import useSearchParams from "../hooks/useSearchParams";
import { DeleteIcon } from "../icons";

export const searchKey = "manage-invitations-dialog";

const useStyles = makeStyles((theme) => ({
  emailInput: {
    margin: "0",
  },
  inputsContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: theme.spacing(2),
    "& > div": {
      width: "100%",
    },
  },
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
}));

export const MANAGE_INVITATIONS_DIALOG_TITLE = "Manage invitations";
const MANAGE_INVITATIONS_DIALOG_DESCRIPTION =
  "Invited players can join the game (they won't be invited automatically). Email address must match each player's Diplicity login details exactly.";
const INVITED_PLAYERS_LABEL = "Invited players";
const MANAGE_INVITATIONS_BUTTON_LABEL = "Submit";
const CANCEL_BUTTON_LABEL = "Cancel";
const INVITE_PLAYER_LABEL = "Create invitation";
const EMAIL_INPUT_LABEL = "Email";
const NATION_INPUT_LABEL = "Nation";
const NO_INVITATIONS_MESSAGE = "You have not invited any players yet.";
const UN_INVITE_BUTTON_TOOLTIP = "Un-invite"

const ManageInvitationsDialog = (): React.ReactElement => {
  const { getParam, removeParam } = useSearchParams();
  const gameId = getParam(searchKey);
  const open = Boolean(gameId);
  const [email, setEmail] = useState("");
  const [nation, setNation] = useState("");
  const classes = useStyles();

  // TODO refactor into hook
  const [getGameTrigger, getGameQuery] = useLazyGetGameQuery();
  useListVariantsQuery(undefined);
  const game = getGameQuery.data;
  const variant = useSelectVariant(game?.Variant || "");
  const nationAllocation = game
    ? nationAllocationMap[game.NationAllocation]
    : "";

  const [unInvite, unInviteQuery] = useUnInviteMutation();
  const [invite, inviteQuery] = useInviteMutation();

  const close = () => {
    removeParam(searchKey);
  };

  useEffect(() => {
    if (gameId) registerPageView("ManageInvitationsDialog");
    if (gameId) getGameTrigger(gameId);
  }, [gameId, getGameTrigger]);

  useEffect(() => {
    if (game) {
      setNation(nationAllocation);
    }
  }, [game, nationAllocation]);

  useEffect(() => {
    if (inviteQuery.isSuccess) {
      registerEvent("manage_invitations_dialog_invite_user");
      setEmail("");
      setNation(nationAllocation);
    }
  }, [inviteQuery.isSuccess, nationAllocation]);

  useEffect(() => {
    if (unInviteQuery.isSuccess)
      registerEvent("manage_invitations_dialog_uninvite_user");
  }, [unInviteQuery.isSuccess]);

  const onSubmit = () => {
    invite({
      gameId: gameId as string,
      Email: email as string,
      Nation: nation as string,
    });
  };

  const onClickUnInvite = (email: string) => {
    unInvite({ gameId: gameId as string, email });
  };

  const nations = variant?.Nations || [];

  const invitations = game?.GameMasterInvitations || [];
  const disabled = !email?.length || !nation || inviteQuery.isLoading;

  // TODO add validation for email and nation
  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>{MANAGE_INVITATIONS_DIALOG_TITLE}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography>{MANAGE_INVITATIONS_DIALOG_DESCRIPTION}</Typography>
        <Typography>{INVITED_PLAYERS_LABEL}</Typography>
        {invitations.length ? (
          invitations.map(({ Nation, Email }) => (
            <ListItem key={Email}>
              <Grid container>
                <Grid key="data" item xs={11}>
                  <Typography>{Email}</Typography>
                  {Nation && (
                    <Typography variant="caption">{Nation}</Typography>
                  )}
                </Grid>
                <Grid key="button" item xs={1}>
                  <Tooltip title={UN_INVITE_BUTTON_TOOLTIP}>
                    <IconButton
                      onClick={() => onClickUnInvite(Email)}
                      disabled={unInviteQuery.isLoading}
                      size="large"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </ListItem>
          ))
        ) : (
          <Typography>{NO_INVITATIONS_MESSAGE}</Typography>
        )}
        <Typography>{INVITE_PLAYER_LABEL}</Typography>
        <div className={classes.inputsContainer}>
          <InputLabel />
          <TextField
            type="email"
            className={classes.emailInput}
            label={EMAIL_INPUT_LABEL}
            margin="dense"
            onChange={(e) => setEmail(e.target.value as string)}
          />
          <Select
            label={NATION_INPUT_LABEL}
            onChange={(e) => setNation(e.target.value as string)}
            value={nation}
          >
            <MenuItem value={nationAllocation}>{nationAllocation}</MenuItem>
            {nations.map((nation) => (
              <MenuItem key={nation} value={nation}>
                {nation}
              </MenuItem>
            ))}
          </Select>
        </div>
        <DialogActions>
          <Button onClick={close}>{CANCEL_BUTTON_LABEL}</Button>
          <Button onClick={onSubmit} disabled={disabled}>
            {MANAGE_INVITATIONS_BUTTON_LABEL}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default ManageInvitationsDialog;
