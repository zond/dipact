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
} from "@mui/material";
import React, { useEffect } from "react";
import useSearchParams from "../hooks/useSearchParams";
import { useTranslation } from "react-i18next";
import { PageName } from "../store/ui";
import { translateKeys as tk } from "@diplicity/common";
import {
  useLazyGetGameQuery,
  useLazyGetGameStateQuery,
  useLazyGetRootQuery,
  useLazyGetUserStatsQuery,
  useLazyListUserBansQuery,
} from "../hooks/service";
import { useLazyPageLoad } from "../hooks/usePageLoad";
import { User, UserStats } from "../store/types";
import {
  ratingPercentile as getRatingPercentile,
  twoDecimals,
} from "../helpers";

export const searchKey = "user-stats";

const decodeSearchValue = (
  searchValue: string | null
): [string | undefined, string | undefined] => {
  if (!searchValue) return [undefined, undefined];
  const [userId, gameId] = searchValue.split(":");
  return [userId, gameId];
};

const ResetSettingsDialog = (): React.ReactElement => {
  const { t } = useTranslation();
  const { getParam, removeParam } = useSearchParams();
  const searchValue = getParam(searchKey);
  const [userId, gameId] = decodeSearchValue(searchValue);

  const close = () => {
    removeParam(searchKey);
  };

  const pageLoadTrigger = useLazyPageLoad(PageName.StatsDialog);
  const [getUserStatsTrigger, getUserStatsQuery] = useLazyGetUserStatsQuery();
  const [getUserTrigger, getUserQuery] = useLazyGetRootQuery();
  const [getGameTrigger, getGameQuery] = useLazyGetGameQuery();
  const [getGameStateTrigger, getGameStateQuery] = useLazyGetGameStateQuery();
  const [getUserBansTrigger, getUserBansQuery] = useLazyListUserBansQuery();

  useEffect(() => {
    if (userId) {
      pageLoadTrigger();
      getUserStatsTrigger(userId);
      getUserTrigger(undefined);
      if (gameId) {
        getGameTrigger(gameId);
        getGameStateTrigger({ gameId, userId });
      }
    }
  }, [
    pageLoadTrigger,
    userId,
    getUserStatsTrigger,
    gameId,
    getUserTrigger,
    getGameTrigger,
    getGameStateTrigger,
  ]);

  useEffect(() => {
    if (getUserQuery.data?.Id) getUserBansTrigger(getUserQuery.data.Id);
  }, [getUserBansTrigger, getUserQuery]);

  const currentUser = getUserQuery.data as User;
  const user = getUserStatsQuery.data?.User as User;
  const userStats = getUserStatsQuery.data as UserStats;
  const currentUserBans = getUserBansQuery.data;
  const game = getGameQuery.data;
  const gameState = getGameStateQuery.data;
  const currentUserNation = game?.Members.find(
    (member) => member.User.Id === user.Id
  )?.Nation;
  const ranking = (userStats.TrueSkill?.HigherRatedCount as number) + 1;
  const rating = twoDecimals(userStats.TrueSkill?.Rating as number);
  const ratingPercentile = getRatingPercentile(
    userStats.TrueSkill?.Rating as number
  );

  const isBanned =
    currentUserBans?.some((ban) => ban.UserIds.includes(user.Id || "")) ||
    false;

  const toggleMuted = () => {
    return;
  };

  return (
    <Dialog open={Boolean(userId)} onClose={close}>
      <DialogTitle>
        {t(tk.statsDialog.title, { username: user.Name })}
      </DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              disabled={user.Id === currentUser.Id}
              checked={isBanned}
              onClick={toggleMuted}
            />
          }
          label={t(tk.statsDialog.mutedCheckbox.label) as string}
        />
        {gameState && currentUserNation && (
          <FormControlLabel
            control={
              <Checkbox
                disabled={user.Id === currentUser.Id}
                checked={(gameState.Muted || []).includes(currentUserNation)}
                onClick={toggleMuted}
              />
            }
            label={t(tk.statsDialog.mutedCheckbox.label) as string}
          />
        )}
        <TableContainer>
          <Table>
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
            </TableRow>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default ResetSettingsDialog;
