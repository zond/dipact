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
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React from "react";
import { useDispatch } from "react-redux";
import { generatePath } from "react-router";
import { useHistory } from "react-router-dom";
import { Game, NationAllocation } from "../hooks/useGameList";
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
import { copyToClipboard } from "../utils/general";
import PlayerCount from "./PlayerCount";
import { actions as feedbackActions } from "../store/feedback";
import useSearchParams from "../hooks/useSearchParams";

const useStyles = makeStyles((theme) => ({
  root: {
    border: "none",
  },
  accordionSummary: {
    width: "100%",
  },
  accordionSummaryContent: {
    width: "100%",
    "& > div": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
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
  game: Game;
}

const defaultProps = {
  space: 1,
};

const PRIVATE_GAME_TOOLTIP = "Private game";
const CHAT_LANGUAGE_TOOLTIP = "Chat language: "; // TODO template when translating
const CHAT_LANGUAGE_LABEL = "Chat language: "; // TODO template when translating
const MIN_QUICKNESS_OR_RELIABILITY_REQUIRED_TOOLTIP =
  "Mininum quickness or reliability required";
const MIN_RATING_REQUIRED_TOOLTIP = "Minumum rating required";
const PREFERENCE_BASED_NATION_ALLOCATION_TOOLTIP =
  "Preference based nation allocation";
const CHAT_DISABLED_TOOLTIP = "Chat disabled";
const VIEW_GAME_BUTTON_LABEL = "View";
const INVITE_BUTTON_LABEL = "Invite";
const JOIN_BUTTON_LABEL = "Join";
const RULES_LABEL = "Rules:";
const PLAYERS_LABEL = "Players:";
const GAME_VARIANT_LABEL = "Game variant: ";
const PHASE_DEADLINE_LABEL = "Phase deadline: ";
const CREATED_AT_LABEL = "Created at: ";
const NATION_ALLOCATION_LABEL = "Nation selection: ";
const LINK_COPIED_TO_CLIPBOARD_FEEDBACK =
  "Game URL copied to clipboard. Share it with other players.";

const FAILED_REQUIREMENTS_LABEL = "You can't join this game:";
const FAILED_REQUIREMENT_EXPLANATION_HATED =
  "You've been reported too often (hated score too high).";
const FAILED_REQUIREMENT_EXPLANATION_HATER =
  "You banned others too often (hater score too high).";
const FAILED_REQUIREMENT_EXPLANATION_MAX_RATING =
  "You're too good (rating too high).";
const FAILED_REQUIREMENT_EXPLANATION_MIN_RATING =
  "You're not good enough yet (rating too low).";
const FAILED_REQUIREMENT_EXPLANATION_MIN_RELIABILITY =
  "You haven't given any orders on too many turns (reliability too low).";
const FAILED_REQUIREMENT_EXPLANATION_MIN_QUICKNESS =
  "You haven't committed your orders often enough (quickness too low).";
const FAILED_REQUIREMENT_EXPLANATION_INVITATION_NEEDED =
  "The game Mmaster hasn't invited you.";

const failedRequirementExplanationMap: { [key: string]: string } = {
  Hated: FAILED_REQUIREMENT_EXPLANATION_HATED,
  Hater: FAILED_REQUIREMENT_EXPLANATION_HATER,
  MaxRating: FAILED_REQUIREMENT_EXPLANATION_MIN_RATING,
  MinRating: FAILED_REQUIREMENT_EXPLANATION_MAX_RATING,
  MinReliability: FAILED_REQUIREMENT_EXPLANATION_MIN_RELIABILITY,
  MinQuickness: FAILED_REQUIREMENT_EXPLANATION_MIN_QUICKNESS,
  InvitationNeeded: FAILED_REQUIREMENT_EXPLANATION_INVITATION_NEEDED,
};

const GameCard = ({ game }: GameCardProps): React.ReactElement => {
  const classes = useStyles();
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
    variantNumNations,
  } = game;

  const numMembers = players.length;

  const history = useHistory();
  const dispatch = useDispatch();
  const { setParam } = useSearchParams();

  const gameUrl = generatePath(RouteConfig.Game, { gameId: id });
  const onClickView = () => history.push(gameUrl);

  const onClickInvite = () => {
    if (false) {
      // TODO do native share on native app
    } else {
      copyToClipboard(gameUrl)
        .then(() => {
          const message = LINK_COPIED_TO_CLIPBOARD_FEEDBACK;
          dispatch(feedbackActions.add({ message, severity: "info" }));
        })
        .catch((error) => {
          dispatch(feedbackActions.add({ message: error, severity: "error" }));
        });
      // TODO
      // gtag("event", "game_share");
    }
  };

  const onClickJoin = () => {
    // if (nationAllocation === NationAllocation.Preference) {
    if (true) {
      setParam("nation-preference-dialog", id);
    } else {
      // joinGameWithPreferences([])
    }
  };

  return (
    <Accordion className={classes.root} elevation={0} square>
      <AccordionSummary
        expandIcon={<ExpandIcon />}
        className={classes.accordionSummary}
      >
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
                {chatLanguage && (
                  <Tooltip title={CHAT_LANGUAGE_TOOLTIP + chatLanguageDisplay}>
                    <div className={classes.chatIconContainer}>
                      <ChatLanguageIcon fontSize={"small"} />
                      <Typography variant={"caption"}>
                        {chatLanguage}
                      </Typography>
                    </div>
                  </Tooltip>
                )}
                {privateGame && (
                  <Tooltip title={PRIVATE_GAME_TOOLTIP}>
                    <PrivateGameIcon fontSize={"small"} />
                  </Tooltip>
                )}
                {(minQuickness || minReliability) && (
                  <Tooltip
                    title={MIN_QUICKNESS_OR_RELIABILITY_REQUIRED_TOOLTIP}
                  >
                    <ReliabilityIcon fontSize={"small"} />
                  </Tooltip>
                )}
                {nationAllocation === NationAllocation.Preference && (
                  <Tooltip title={PREFERENCE_BASED_NATION_ALLOCATION_TOOLTIP}>
                    <NationAllocationIcon fontSize={"small"} />
                  </Tooltip>
                )}
                {minRating && (
                  <Tooltip title={MIN_RATING_REQUIRED_TOOLTIP}>
                    <RatingIcon fontSize={"small"} />
                  </Tooltip>
                )}
                {chatDisabled && (
                  <Tooltip title={CHAT_DISABLED_TOOLTIP}>
                    <ChatDisabledIcon fontSize={"small"} />
                  </Tooltip>
                )}
              </div>
              <Typography variant={"caption"}>{phaseSummary}</Typography>
            </div>
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <div className={classes.buttons}>
          <Button variant={"outlined"} onClick={onClickView}>
            {VIEW_GAME_BUTTON_LABEL}
          </Button>
          <Button variant={"outlined"} onClick={onClickInvite}>
            {INVITE_BUTTON_LABEL}
          </Button>
          <Button
            variant={"outlined"}
            onClick={onClickJoin}
            disabled={Boolean(failedRequirements.length)}
          >
            {JOIN_BUTTON_LABEL}
          </Button>
        </div>
        <div>
          <Typography>{FAILED_REQUIREMENTS_LABEL}</Typography>
          <List>
            {failedRequirements.map((req) => (
              <ListItem dense key={req}>
                <Typography>{failedRequirementExplanationMap[req]}</Typography>
              </ListItem>
            ))}
          </List>
        </div>
        <div>
          <Typography variant={"caption"}>{RULES_LABEL}</Typography>
          <div className={classes.rules}>
            <div>
              <div className={classes.chatIconContainer}>
                <ChatLanguageIcon fontSize={"small"} />
                <Typography variant={"caption"}>{chatLanguage}</Typography>
              </div>
              <Typography>
                {CHAT_LANGUAGE_LABEL + chatLanguageDisplay}
              </Typography>
            </div>
            <div>
              <GameVariantIcon fontSize={"small"} />
              <Typography>{GAME_VARIANT_LABEL + gameVariant}</Typography>
            </div>
            <div>
              <PhaseDeadlineIcon fontSize={"small"} />
              <Typography>{PHASE_DEADLINE_LABEL + deadlineDisplay}</Typography>
            </div>
            <div>
              <CreatedAtIcon fontSize={"small"} />
              <Typography>{CREATED_AT_LABEL + createdAtDisplay}</Typography>
            </div>
            <div>
              <NationAllocationIcon fontSize={"small"} />
              <Typography>
                {NATION_ALLOCATION_LABEL + nationAllocation}
              </Typography>
            </div>
          </div>
        </div>
        <div>
          <Typography variant={"caption"}>{PLAYERS_LABEL}</Typography>
          <div className={classes.players}>
            {players.map(({ username, image }) => (
              <div key={username}>
                <IconButton onClick={() => {}} size="large">
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
