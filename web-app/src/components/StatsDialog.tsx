import {
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  FormControlLabel,
  TableContainer,
  Table,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import React from "react";
import useSearchParams from "../hooks/useSearchParams";
import { useTranslation } from "react-i18next";
import tk from "../translations/translateKeys";
import useStatsDialog from "../hooks/useStatsDialog";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

export const searchKey = "user-stats";

const decodeSearchValue = (
  searchValue: string | null
): [string | undefined, string | undefined] => {
  if (!searchValue) return [undefined, undefined];
  const [userId, gameId] = searchValue.split(":");
  return [userId, gameId];
};

const StatsDialog = (): React.ReactElement => {
  const { t } = useTranslation();
  const { getParam, removeParam } = useSearchParams();
  const searchValue = getParam(searchKey);
  const [userId, gameId] = decodeSearchValue(searchValue);

  const close = () => {
    removeParam(searchKey);
  };

  const {
    abandonedGames,
    banIsLoading,
    draws,
    eliminations,
    error,
    finishedGames,
    hated,
    hater,
    isBanned,
    isCurrentUser,
    isError,
    isLoading,
    isMuted,
    joinedGames,
    nation,
    quickness,
    ranking,
    rating,
    ratingPercentile,
    reliability,
    showIsMuted,
    soloWins,
    startedGames,
    toggleBanned,
    toggleMuted,
    username,
  } = useStatsDialog(userId, gameId);

  return (
    <Dialog open={Boolean(userId)} onClose={close}>
      {isLoading ? (
        <DialogContent>
          <Loading />
        </DialogContent>
      ) : isError && error ? (
        <ErrorMessage error={error} />
      ) : (
        <>
          <DialogTitle>
            {nation
              ? t(tk.statsDialog.titleWithNation, { username, nation })
              : t(tk.statsDialog.title, { username })}
          </DialogTitle>
          <DialogContent>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={isCurrentUser || banIsLoading}
                  checked={isBanned}
                  onClick={toggleBanned}
                />
              }
              label={t(tk.statsDialog.bannedCheckbox.label) as string}
            />
            {showIsMuted && (
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={isCurrentUser}
                    checked={isMuted}
                    onClick={toggleMuted}
                  />
                }
                label={t(tk.statsDialog.mutedCheckbox.label) as string}
              />
            )}
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>{t(tk.statsDialog.ranking.label)}</TableCell>
                    <TableCell>
                      {t(tk.statsDialog.ranking.value, {
                        value: ranking,
                      })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t(tk.statsDialog.rating.label)}</TableCell>
                    <TableCell>{rating}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {t(tk.statsDialog.ratingPercentile.label)}
                    </TableCell>
                    <TableCell>
                      {t(tk.statsDialog.ratingPercentile.value, {
                        value: ratingPercentile,
                      })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t(tk.statsDialog.reliability.label)}</TableCell>
                    <TableCell>{reliability}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t(tk.statsDialog.quickness.label)}</TableCell>
                    <TableCell>{quickness}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t(tk.statsDialog.hated.label)}</TableCell>
                    <TableCell>{hated}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t(tk.statsDialog.hater.label)}</TableCell>
                    <TableCell>{hater}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t(tk.statsDialog.joinedGames.label)}</TableCell>
                    <TableCell>{joinedGames}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {t(tk.statsDialog.startedGames.label)}
                    </TableCell>
                    <TableCell>{startedGames}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {t(tk.statsDialog.finishedGames.label)}
                    </TableCell>
                    <TableCell>{finishedGames}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {t(tk.statsDialog.abandonedGames.label)}
                    </TableCell>
                    <TableCell>{abandonedGames}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t(tk.statsDialog.soloWins.label)}</TableCell>
                    <TableCell>{soloWins}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t(tk.statsDialog.draws.label)}</TableCell>
                    <TableCell>{draws}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {t(tk.statsDialog.eliminations.label)}
                    </TableCell>
                    <TableCell>{eliminations}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default StatsDialog;
