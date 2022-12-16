import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Tooltip,
  Button,
  Avatar,
  IconButton,
  List,
  ListItem,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import { generatePath } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { GameDisplay, NationAllocation } from "@diplicity/common";
import {
  ChatDisabledIcon,
  ChatLanguageIcon,
  CreatedAtIcon,
  ExpandIcon,
  GameVariantIcon,
  NationAllocationIcon,
  PhaseDeadlineIcon,
  PrivateGameIcon,
  RatingIcon,
  ReliabilityIcon,
  StartedAtIcon,
} from "../icons";
import { RouteConfig } from "../pages/RouteConfig";
import PlayerCount from "./PlayerCount";
import useSearchParams from "../hooks/useSearchParams";
import { useTranslation } from "react-i18next";
import { useGameCard, translateKeys as tk } from "@diplicity/common";

const useStyles = makeStyles((theme) => ({
  root: {
    border: "none",
  },
  accordionSummaryContent: {
    "& > div": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
  },
  gameSummaryButton: {
    cursor: "pointer",
    background: "inherit",
    border: "inherit",
    width: "inherit",
    padding: 0,
    borderTop: "1px solid",
    borderColor: "rgba(0, 0, 0, 0.08)",
    "& :hover": {
      background: "#DDDDDD",
    },
    "& > div": {
      padding: theme.spacing(2),
    },
  },
  accordionDetails: {
    flexDirection: "column",
    display: "flex",
    gap: theme.spacing(1),
  },
  deadline: {
    display: "flex",
  },
  icons: {
    display: "flex",
  },
  numMembers: {
    display: "flex",
  },
  phaseSummaryContainer: {
    display: "flex",
    alignItems: "center",
  },
  chatIconContainer: {
    display: "flex",
    "& > span": {
      position: "absolute",
      color: theme.palette.background.paper,
      paddingLeft: "3px",
    },
  },
  buttons: {
    display: "flex",
    gap: theme.spacing(1),
    "& a": {
      textDecoration: "none",
    },
  },
  rules: {
    display: "flex",
    flexDirection: "column",
    "& > div": {
      display: "flex",
      gap: theme.spacing(1),
      alignItems: "center",
    },
  },
  players: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    "& > div": {
      display: "flex",
      gap: theme.spacing(1),
      alignItems: "center",
    },
    "& button": {
      padding: 0,
    },
  },
}));

interface GameCardProps {
  game: GameDisplay;
  summaryOnly?: true;
}

const defaultProps = {
  space: 1,
};

// TODO move to common
const failedRequirementExplanationMap: { [key: string]: string } = {
  Hated: tk.gameList.gameCard.failedRequirements.hated,
  Hater: tk.gameList.gameCard.failedRequirements.hater,
  MaxRating: tk.gameList.gameCard.failedRequirements.maxRating,
  MinRating: tk.gameList.gameCard.failedRequirements.minRating,
  MinReliability: tk.gameList.gameCard.failedRequirements.minReliability,
  MinQuickness: tk.gameList.gameCard.failedRequirements.minQuickness,
  InvitationNeeded: tk.gameList.gameCard.failedRequirements.invitationNeeded,
};

const GameCard = ({ game, summaryOnly }: GameCardProps): React.ReactElement => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    chatDisabled,
    chatLanguage,
    chatLanguageDisplay,
    createdAtDisplay,
    deadlineDisplay,
    failedRequirements,
    gameVariant,
    id,
    minQuickness,
    minRating,
    minReliability,
    name,
    nationAllocation,
    numUnreadMessages,
    phaseSummary,
    privateGame,
    players,
    rulesSummary,
    started,
    userIsMember,
    userIsGameMaster,
    variantNumNations,
  } = game;

  const numMembers = players.length;

  const history = useHistory();
  const { setParam } = useSearchParams();

  const { deleteGame, isLoading, joinGame } = useGameCard(id);

  const gameUrl = generatePath(RouteConfig.Game, { gameId: id });
  const onClickView = () => history.push(gameUrl);

  const onClickJoin = () => {
    if (nationAllocation === NationAllocation.Preference) {
      setParam("nation-preference-dialog", id);
    } else {
      // TODO move to middleware
      joinGame({ NationPreferences: "", GameAlias: "" });
    }
  };

  const onClickReschedule = () => setParam("reschedule-dialog", id);
  const onClickRename = () => setParam("rename-game-dialog", id);
  const onClickManageInvitations = () =>
    setParam("manage-invitations-dialog", id);

  const GameSummary = (
    <div className={classes.accordionSummaryContent}>
      <div>
        <Badge
          badgeContent={numUnreadMessages}
          color="primary"
          invisible={!Boolean(numUnreadMessages)}
        >
          <Typography>{name}</Typography>
        </Badge>
        {started ? (
          <div className={classes.deadline}>
            <StartedAtIcon />
            <Typography>{deadlineDisplay}</Typography>
          </div>
        ) : (
          <PlayerCount
            numPlayers={numMembers}
            maxNumPlayers={variantNumNations}
          />
        )}
      </div>
      <div>
        <Typography variant={"caption"}>{rulesSummary}</Typography>
        <div className={classes.phaseSummaryContainer}>
          <div className={classes.icons}>
            {Boolean(chatLanguage) && (
              <Tooltip
                title={
                  t(tk.gameList.gameCard.chatLanguageIcon.tooltip, {
                    language: chatLanguageDisplay,
                  }) as string
                }
              >
                <div className={classes.chatIconContainer}>
                  <ChatLanguageIcon fontSize={"small"} />
                  <Typography variant={"caption"}>{chatLanguage}</Typography>
                </div>
              </Tooltip>
            )}
            {privateGame && (
              <Tooltip
                title={
                  t(tk.gameList.gameCard.privateGameIcon.tooltip) as string
                }
              >
                <PrivateGameIcon fontSize={"small"} />
              </Tooltip>
            )}
            {Boolean(minQuickness || minReliability) && (
              <Tooltip
                title={
                  t(
                    tk.gameList.gameCard.minQuicknessOrReliabilityRequiredIcon
                      .tooltip
                  ) as string
                }
              >
                <ReliabilityIcon fontSize={"small"} />
              </Tooltip>
            )}
            {nationAllocation === NationAllocation.Preference && (
              <Tooltip
                title={
                  t(
                    tk.gameList.gameCard.preferenceBaseNationAllocationIcon
                      .tooltip
                  ) as string
                }
              >
                <NationAllocationIcon fontSize={"small"} />
              </Tooltip>
            )}
            {Boolean(minRating) && (
              <Tooltip
                title={
                  t(
                    tk.gameList.gameCard.minRatingRequiredIcon.tooltip
                  ) as string
                }
              >
                <RatingIcon fontSize={"small"} />
              </Tooltip>
            )}
            {chatDisabled && (
              <Tooltip
                title={
                  t(tk.gameList.gameCard.chatDisabledIcon.tooltip) as string
                }
              >
                <ChatDisabledIcon fontSize={"small"} />
              </Tooltip>
            )}
          </div>
          <Typography variant={"caption"}>{phaseSummary}</Typography>
        </div>
      </div>
    </div>
  );

  if (summaryOnly)
    return (
      <button
        type="button"
        className={classes.gameSummaryButton}
        onClick={onClickView}
        title={game.name}
      >
        {GameSummary}
      </button>
    );

  return (
    <Accordion
      className={classes.root}
      elevation={0}
      TransitionProps={{ unmountOnExit: true }}
      square
    >
      <AccordionSummary expandIcon={<ExpandIcon />} title={"Expand"}>
        {GameSummary}
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <div className={classes.buttons}>
          <a
            href={generatePath(RouteConfig.Game, { gameId: id })}
            target={"_blank"}
            rel="noreferrer"
          >
            <Button variant={"outlined"} onClick={onClickView}>
              {t(tk.gameList.gameCard.viewButton.label)}
            </Button>
          </a>
          {/* <Button variant={"outlined"} onClick={() => onClickInvite(gameUrl)}>
            {t(tk.gameList.gameCard.inviteButton.label)}
          </Button> */}
          <Button
            variant={"outlined"}
            onClick={onClickJoin}
            disabled={Boolean(failedRequirements.length) || isLoading}
          >
            {t(tk.gameList.gameCard.joinButton.label)}
          </Button>
          {/* // if len(g.NewestPhaseMeta) == 1 && !g.NewestPhaseMeta[0].Resolved */}
          {userIsMember && (
            <Button variant={"outlined"} onClick={onClickRename}>
              {t(tk.gameList.gameCard.renameButton.label)}
            </Button>
          )}
          {userIsGameMaster && (
            <>
              <Button variant={"outlined"} onClick={onClickReschedule}>
                {t(tk.gameList.gameCard.rescheduleButton.label)}
              </Button>
              <Button variant={"outlined"} onClick={onClickManageInvitations}>
                {t(tk.gameList.gameCard.manageInvitationsButton.label)}
              </Button>
              <Button
                variant={"outlined"}
                onClick={deleteGame}
                disabled={isLoading}
              >
                {t(tk.gameList.gameCard.deleteButton.label)}
              </Button>
            </>
          )}
        </div>
        <div>
          {Boolean(failedRequirements.length) && (
            <Typography>
              {t(tk.gameList.gameCard.failedRequirements.label)}
            </Typography>
          )}
          <List>
            {failedRequirements.map((req) => (
              <ListItem dense key={req}>
                <Typography>
                  {t(failedRequirementExplanationMap[req])}
                </Typography>
              </ListItem>
            ))}
          </List>
        </div>
        <div>
          <Typography variant={"caption"}>
            {t(tk.gameList.gameCard.rules.label)}
          </Typography>
          <div className={classes.rules}>
            <div>
              <div className={classes.chatIconContainer}>
                <ChatLanguageIcon fontSize={"small"} />
                <Typography variant={"caption"}>{chatLanguage}</Typography>
              </div>
              <Typography>
                {t(tk.gameList.gameCard.chatLanguageRule.label, {
                  language: chatLanguageDisplay,
                })}
              </Typography>
            </div>
            <div>
              <GameVariantIcon fontSize={"small"} />
              <Typography>
                {t(tk.gameList.gameCard.gameVariantRule.label, {
                  variant: gameVariant,
                })}
              </Typography>
            </div>
            <div>
              <PhaseDeadlineIcon fontSize={"small"} />
              <Typography>
                {t(tk.gameList.gameCard.phaseDeadlineRule.label, {
                  deadline: deadlineDisplay,
                })}
              </Typography>
            </div>
            <div>
              <CreatedAtIcon fontSize={"small"} />
              <Typography>
                {t(tk.gameList.gameCard.createdAtRule.label, {
                  createdAt: createdAtDisplay,
                })}
              </Typography>
            </div>
            <div>
              <NationAllocationIcon fontSize={"small"} />
              <Typography>
                {t(tk.gameList.gameCard.nationAllocationRule.label, {
                  nationAllocation,
                })}
              </Typography>
            </div>
          </div>
        </div>
        <div>
          <Typography variant={"caption"}>
            {t(tk.gameList.gameCard.players.label)}
          </Typography>
          <div className={classes.players}>
            {players.map(({ username, image }) => (
              <div key={username}>
                <IconButton size="medium">
                  <Avatar src={image} alt={username} />
                </IconButton>
                <Typography>{username}</Typography>
              </div>
            ))}
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

GameCard.defaultProps = defaultProps;

export default GameCard;
