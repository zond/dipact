import React, { useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControlLabel,
  Avatar,
  IconButton,
} from "@mui/material";
import tk from "../translations/translateKeys";

import { ExpandIcon } from "../icons";
// import GameMetadata from "./GameMetadata";
import { useLazyPageLoad } from "../hooks/usePageLoad";
import { PageName } from "../store/ui";
import { useTranslation } from "react-i18next";
import useSearchParams from "../hooks/useSearchParams";
import useGamePlayers from "../hooks/useGamePlayers";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

export const searchKey = "game-players";

const GamePlayers = () => {
  const triggerPageLoad = useLazyPageLoad(PageName.GamePlayersDialog);
  const { t } = useTranslation();
  const { getParam, removeParam } = useSearchParams();
  const gameId = getParam(searchKey) || "";
  const open = Boolean(gameId.length);
  const close = () => {
    removeParam(searchKey);
  };
  useEffect(() => {
    if (open) triggerPageLoad(gameId);
  }, [gameId, open, triggerPageLoad]);

  const {
    error,
    isLoading,
    isError,
    players,
    toggleBanned,
    toggleMuted,
    variantRules,
  } = useGamePlayers(gameId);

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>{t(tk.gamePlayersDialog.title)}</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Loading />
        ) : isError && error ? (
          <ErrorMessage error={error} />
        ) : (
          <>
            <section>
              <Typography variant="subtitle2">
                {t(tk.gamePlayersDialog.gameMetaDataSection.title)}
              </Typography>
              {/* <GameMetadata game={this.props.game} noplayerlist="true" /> */}
            </section>
            <section>
              <Accordion square>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="subtitle2">
                    {t(tk.gamePlayersDialog.variantRulesSection.title)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle2">{variantRules}</Typography>
                </AccordionDetails>
              </Accordion>
            </section>
            <section>
              <Typography variant="subtitle2">
                {t(tk.gamePlayersDialog.playersSection.title)}
              </Typography>
              <Typography variant="subtitle2">
                {t(tk.gamePlayersDialog.playersSection.subtitle)}
              </Typography>
              {players.map(
                ({
                  id,
                  image,
                  isBanned,
                  isCurrentUser,
                  isMuted,
                  nation,
                  username,
                }) => (
                  <div key={username}>
                    <div>
                      <IconButton onClick={() => {}} size="large">
                        <Avatar src={image} alt={username} />
                      </IconButton>
                    </div>

                    <div>
                      <Typography variant="body1">{nation}</Typography>
                      <Typography variant="subtitle2">{username}</Typography>
                    </div>

                    <div>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={isCurrentUser}
                            checked={isBanned}
                            onChange={() => toggleBanned(id)}
                            color="primary"
                          />
                        }
                        label={
                          t(
                            tk.gamePlayersDialog.playersSection.banCheckbox
                              .label
                          ) as string
                        }
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={isCurrentUser}
                            checked={isMuted}
                            onChange={() => toggleMuted(nation)}
                            color="primary"
                          />
                        }
                        label={
                          t(
                            tk.gamePlayersDialog.playersSection.muteCheckbox
                              .label
                          ) as string
                        }
                      />
                    </div>
                  </div>
                )
              )}
            </section>
            <DialogActions>
              <Button onClick={close} color="primary">
                {t(tk.gamePlayersDialog.closeButton.label)}
              </Button>
            </DialogActions>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GamePlayers;
