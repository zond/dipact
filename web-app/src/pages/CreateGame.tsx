import React, { useState } from "react";

import {
  Container,
  List,
  ListItem,
  FormControlLabel,
  FormHelperText,
  Switch,
  Typography,
  TextField,
  IconButton,
  Checkbox,
  FormGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Radio,
  RadioGroup,
  Box,
  Button,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import GoBackNav from "../components/GoBackNav";
import useSearchParams from "../hooks/useSearchParams";
import { iso639_1Codes, randomGameName } from "../helpers";
import { RandomGameNameIcon } from "../icons";
import useCreateGame from "../hooks/useCreateGame";
import Loading from "../components/Loading";
import { nationAllocationMap } from "../hooks/useGameList";
import { useTranslation } from "react-i18next";
import tk from "../translations/translateKeys";

const useStyles = makeStyles((theme) => ({
  root: {
    "& h6": {
      padding: theme.spacing(1, 0),
    },
    "& form": {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(2),
    },
  },
  nameInputContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& > div": {
      width: "100%",
    },
  },
  variantSelect: {
    width: "100%",
  },
  variantSVGContainer: {
    "& > svg": {
      maxHeight: "300px",
    },
  },
  variantDetailList: {
    "& > li": {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  variantDescription: {
    padding: theme.spacing(2, 0),
    fontStyle: "italic",
  },
  nationAllocationContainer: {
    display: "flex",
    gap: theme.spacing(1),
    flexDirection: "row",
  },
  buttonContainer: {
    display: "flex",
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    justifyContent: "center",
  },
}));

const PRIVATE_CHECKBOX_LABEL = "Private";
const GAME_MASTER_CHECKBOX_LABEL = "Manage as Game Master";
const GAME_MASTER_EXPLANATION =
  "As game master, you can pause/resume games and control who joins (and as what nation). To play yourself, you need to join as a player after creating your game.";
const GAME_MASTER_DISABLED_EXPLANATION =
  "Game master only allowed in private games (risk of abuse)";
const VARIANT_SELECT_LABEL = "Variant";
const VARIANT_START_YEAR_LABEL = "Start year";
const VARIANT_AUTHOR_LABEL = "Original author";
const VARIANT_RULES_LABEL = "Rules";
const NATION_ALLOCATION_LABEL = "Nation selection";
const GAME_LENGTH_SECTION_LABEL = "Game length";
const PHASE_LENGTH_LABEL = "Phase length";
const ADJUSTMENT_PHASE_LENGTH_LABEL = "Adjustment phase length";
const CUSTOM_ADJUSTMENT_PHASE_LENGTH_CHECKBOX_LABEL =
  "Shorter adjustment phases";
const SKIP_GET_READY_PHASE_CHECKBOX_LABEL = "Skip get ready phase";
const SKIP_GET_READY_PHASE_HELP_TEXT =
  "The Get Ready phase asks players to confirm they're ready. If players don't respond, they are removed and the game goes back to try to find replacements before the game can start. This prevents absent people ruining a game.";
const END_AFTER_YEARS_CHECKBOX_LABEL = "End in draw after number of years";
const END_AFTER_YEARS_VALUE_INPUT_LABEL = "End after year";
const CHAT_SECTION_LABEL = "Chat";
const ALLOW_CHATS_LABEL = "Allow chats";
const CONFERENCE_CHAT_ENABLED_CHECKBOX_LABEL = "Conference (all players)";
const GROUP_CHAT_ENABLED_CHECKBOX_LABEL = "Group";
const INDIVIDUAL_CHAT_ENABLED_CHECKBOX_LABEL = "Individual";
const ANONYMOUS_ENABLED_CHECKBOX_LABEL = "Anonymous";
const ANONYMOUS_PRIVATE_EXPLANATION =
  "Anonymous only allowed in private games (risk of abuse)";
const CHAT_LANGUAGE_INPUT_LABEL = "Chat language";
const PLAYERS_CHOICE_OPTION_LABEL = "Player's choice";
const REQUIREMENTS_SECTION_LABEL = "Player requirements";
const RELIABILITY_ENABLED_CHECKBOX_LABEL = "Reliability (important)";
const RELIABILITY_ENABLED_CHECKBOX_HELP_TEXT = "Find players that keep playing";
const MIN_RELIABILITY_INPUT_LABEL = "Minimum reliability score";

const QUICKNESS_ENABLED_CHECKBOX_LABEL = "Quickness";
const QUICKNESS_ENABLED_CHECKBOX_HELP_TEXT =
  "Find players that confirm their orders before the deadline";
const MIN_QUICKNESS_INPUT_LABEL = "Minimum quickness score";

const MIN_RATING_ENABLED_CHECKBOX_LABEL = "Minimum rating";
const MIN_RATING_ENABLED_CHECKBOX_HELP_TEXT =
  "Find players that are challenging";
const MIN_RATING_INPUT_LABEL = "Minimum rating";
// TODO formatting and error message on too much
const MIN_RATING_INPUT_HELP_TEXT =
  "Removes the least challenging 0% of active playrers";

const MAX_RATING_ENABLED_CHECKBOX_LABEL = "Maximum rating";
const MAX_RATING_ENABLED_CHECKBOX_HELP_TEXT =
  "Find players that aren't challenging";
const MAX_RATING_INPUT_LABEL = "Maximum rating";
// TODO formatting and error message on too much
const MAX_RATING_INPUT_HELP_TEXT =
  "Removes the most challenging 0% of active players";

const CREATE_GAME_BUTTON_LABEL = "Create";

const MINUTE_SINGULAR = "Minute";
const MINUTE_PLURAL = "Minutes";
const HOUR_SINGULAR = "Hour";
const HOUR_PLURAL = "Hours";
const DAY_SINGULAR = "Day";
const DAY_PLURAL = "Days";

const CreateGame = (): React.ReactElement => {
  const { t, i18n } = useTranslation("common");
  const { setParam } = useSearchParams();
  console.log(i18n.languages);
  const {
    handleChange,
    handleSubmit,
    randomizeName,
    selectedVariant,
    selectedVariantSVG,
    userStats,
    values,
    variants,
    validationErrors,
  } = useCreateGame();

  const classes = useStyles();
  const singularPhaseLength = values.phaseLengthMultiplier === 1;
  const singularAdjustmentPhaseLength =
    values.adjustmentPhaseLengthMultiplier === 1;
  const minEndAfterYearsValue = (selectedVariant?.Start?.Year || 0) + 1;
  const submitDisabled = Object.keys(validationErrors).length !== 0;

  return (
    <GoBackNav title={t(tk.CreateGameTitle)}>
      <Container className={classes.root}>
        <form onSubmit={handleSubmit}>
          <section>
            <div className={classes.nameInputContainer}>
              <TextField
                variant="standard"
                label={t(tk.CreateGameNameInputLabel)}
                name="name"
                margin="dense"
                value={values.name}
                onChange={handleChange}
              />
              <IconButton onClick={randomizeName} size="large">
                <RandomGameNameIcon />
              </IconButton>
            </div>
          </section>
          <section>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name="privateGame"
                    checked={values.privateGame}
                    onChange={handleChange}
                  />
                }
                label={PRIVATE_CHECKBOX_LABEL}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="gameMaster"
                    checked={values.gameMaster}
                    onChange={handleChange}
                    disabled={!values.privateGame}
                  />
                }
                label={GAME_MASTER_CHECKBOX_LABEL}
              />
              {values.privateGame ? (
                <FormHelperText>{GAME_MASTER_EXPLANATION}</FormHelperText>
              ) : (
                <FormHelperText>
                  {GAME_MASTER_DISABLED_EXPLANATION}
                </FormHelperText>
              )}
            </FormGroup>
          </section>
          <section>
            {selectedVariant ? (
              <>
                <FormControl
                  variant="standard"
                  className={classes.variantSelect}
                >
                  <InputLabel id="variant-input-label">
                    {VARIANT_SELECT_LABEL}
                  </InputLabel>
                  <Select
                    labelId="variant-input-label"
                    value={values.variant}
                    onChange={(e) => handleChange(e as React.ChangeEvent<any>)}
                  >
                    {variants.map((variant) => (
                      <MenuItem key={variant.Name} value={variant.Name}>
                        {/* TODO format string when translating */}
                        {variant.Name} ({variant.Nations.length} players)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography className={classes.variantDescription}>
                  {selectedVariant.Description}
                </Typography>
                {selectedVariantSVG && (
                  <div
                    className={classes.variantSVGContainer}
                    dangerouslySetInnerHTML={{ __html: selectedVariantSVG }}
                  />
                )}
                <List className={classes.variantDetailList}>
                  <ListItem>
                    <Typography variant="caption">
                      {VARIANT_START_YEAR_LABEL}
                    </Typography>
                    <Typography>{selectedVariant.Start?.Year}</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="caption">
                      {VARIANT_AUTHOR_LABEL}
                    </Typography>
                    <Typography>{selectedVariant.CreatedBy}</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="caption">
                      {VARIANT_RULES_LABEL}
                    </Typography>
                    <Typography>{selectedVariant.Rules}</Typography>
                  </ListItem>
                </List>
              </>
            ) : (
              <Loading />
            )}
          </section>
          <section>
            <Typography variant="caption">{NATION_ALLOCATION_LABEL}</Typography>

            <RadioGroup
              value={values.nationAllocation}
              onChange={handleChange}
              name="nationAllocation"
              className={classes.nationAllocationContainer}
            >
              <FormControlLabel
                value={0}
                control={<Radio />}
                label={nationAllocationMap[0]}
              />
              <FormControlLabel
                value={1}
                control={<Radio />}
                label={nationAllocationMap[1]}
              />
            </RadioGroup>
          </section>
          <section>
            <Typography variant="caption">
              {GAME_LENGTH_SECTION_LABEL}
            </Typography>

            <Box display="flex">
              <TextField
                name="phaseLengthMultiplier"
                label={PHASE_LENGTH_LABEL}
                type="number"
                inputProps={{ min: 1 }}
                value={values.phaseLengthMultiplier}
                onChange={handleChange}
                variant="standard"
              />
              <Select
                name="phaseLengthUnit"
                value={values.phaseLengthUnit}
                onChange={(e) => handleChange(e as React.ChangeEvent<any>)}
                variant="standard"
              >
                <MenuItem key={1} value={1}>
                  {singularPhaseLength ? MINUTE_SINGULAR : MINUTE_PLURAL}
                </MenuItem>
                <MenuItem key={60} value={60}>
                  {singularPhaseLength ? HOUR_SINGULAR : HOUR_PLURAL}
                </MenuItem>
                <MenuItem key={60 * 24} value={60 * 24}>
                  {singularPhaseLength ? DAY_SINGULAR : DAY_PLURAL}
                </MenuItem>
              </Select>
            </Box>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    name="customAdjustmentPhaseLength"
                    checked={values.customAdjustmentPhaseLength}
                    onChange={handleChange}
                  />
                }
                label={CUSTOM_ADJUSTMENT_PHASE_LENGTH_CHECKBOX_LABEL}
              />
            </div>
            {/* TODO componentize */}
            {values.customAdjustmentPhaseLength && (
              <Box display="flex">
                <TextField
                  name="adjustmentPhaseLengthMultiplier"
                  label={ADJUSTMENT_PHASE_LENGTH_LABEL}
                  type="number"
                  inputProps={{ min: 1 }}
                  value={values.adjustmentPhaseLengthMultiplier}
                  onChange={handleChange}
                  variant="standard"
                />
                <Select
                  name="adjustmentPhaseLengthUnit"
                  value={values.adjustmentPhaseLengthUnit}
                  onChange={(e) => handleChange(e as React.ChangeEvent<any>)}
                  variant="standard"
                >
                  <MenuItem key={1} value={1}>
                    {singularAdjustmentPhaseLength
                      ? MINUTE_SINGULAR
                      : MINUTE_PLURAL}
                  </MenuItem>
                  <MenuItem key={60} value={60}>
                    {singularAdjustmentPhaseLength
                      ? HOUR_SINGULAR
                      : HOUR_PLURAL}
                  </MenuItem>
                  <MenuItem key={60 * 24} value={60 * 24}>
                    {singularAdjustmentPhaseLength ? DAY_SINGULAR : DAY_PLURAL}
                  </MenuItem>
                </Select>
              </Box>
            )}
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    name="skipGetReadyPhase"
                    checked={values.skipGetReadyPhase}
                    onChange={handleChange}
                  />
                }
                label={SKIP_GET_READY_PHASE_CHECKBOX_LABEL}
              />
            </div>
            <FormHelperText>{SKIP_GET_READY_PHASE_HELP_TEXT}</FormHelperText>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    name="endAfterYears"
                    checked={values.endAfterYears}
                    onChange={handleChange}
                  />
                }
                label={END_AFTER_YEARS_CHECKBOX_LABEL}
              />
            </div>
            {values.endAfterYears && (
              <TextField
                name="endAfterYearsValue"
                label={END_AFTER_YEARS_VALUE_INPUT_LABEL}
                type="number"
                inputProps={{ min: minEndAfterYearsValue }}
                value={values.endAfterYearsValue}
                onChange={handleChange}
                variant="standard"
              />
            )}
          </section>
          <section>
            <Typography variant="caption">{CHAT_SECTION_LABEL}</Typography>
            <Typography variant="caption">{ALLOW_CHATS_LABEL}</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name="conferenceChatEnabled"
                    checked={values.conferenceChatEnabled}
                    onChange={handleChange}
                  />
                }
                label={CONFERENCE_CHAT_ENABLED_CHECKBOX_LABEL}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="groupChatEnabled"
                    checked={values.groupChatEnabled}
                    onChange={handleChange}
                  />
                }
                label={GROUP_CHAT_ENABLED_CHECKBOX_LABEL}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="individualChatEnabled"
                    checked={values.individualChatEnabled}
                    onChange={handleChange}
                  />
                }
                label={INDIVIDUAL_CHAT_ENABLED_CHECKBOX_LABEL}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="anonymousEnabled"
                    checked={values.anonymousEnabled}
                    onChange={handleChange}
                    disabled={!values.privateGame}
                  />
                }
                label={ANONYMOUS_ENABLED_CHECKBOX_LABEL}
              />
              {!values.privateGame && (
                <FormHelperText>{ANONYMOUS_PRIVATE_EXPLANATION}</FormHelperText>
              )}
            </FormGroup>
            <FormControl variant="standard">
              <InputLabel id="chat-language-input-label">
                {CHAT_LANGUAGE_INPUT_LABEL}
              </InputLabel>
              <Select
                labelId="chat-language-input-label"
                value={values.chatLanguage}
                onChange={(e) => handleChange(e as React.ChangeEvent<any>)}
              >
                <MenuItem value="players_choice">
                  {PLAYERS_CHOICE_OPTION_LABEL}
                </MenuItem>
                {iso639_1Codes.map((lang) => {
                  return (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </section>
          <section>
            <Typography variant="caption">
              {REQUIREMENTS_SECTION_LABEL}
            </Typography>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    name="reliabilityEnabled"
                    checked={values.reliabilityEnabled}
                    onChange={handleChange}
                  />
                }
                label={RELIABILITY_ENABLED_CHECKBOX_LABEL}
              />
              <FormHelperText>
                {RELIABILITY_ENABLED_CHECKBOX_HELP_TEXT}
              </FormHelperText>
              {values.reliabilityEnabled && (
                <TextField
                  variant="standard"
                  label={MIN_RELIABILITY_INPUT_LABEL}
                  name="minReliability"
                  type="number"
                  margin="dense"
                  value={values.minReliability}
                  onChange={handleChange}
                />
              )}
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    name="quicknessEnabled"
                    checked={values.quicknessEnabled}
                    onChange={handleChange}
                  />
                }
                label={QUICKNESS_ENABLED_CHECKBOX_LABEL}
              />
              <FormHelperText>
                {QUICKNESS_ENABLED_CHECKBOX_HELP_TEXT}
              </FormHelperText>
              {values.quicknessEnabled && (
                <TextField
                  variant="standard"
                  label={MIN_QUICKNESS_INPUT_LABEL}
                  name="minQuickness"
                  type="number"
                  margin="dense"
                  value={values.minQuickness}
                  onChange={handleChange}
                />
              )}
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    name="minRatingEnabled"
                    checked={values.minRatingEnabled}
                    onChange={handleChange}
                  />
                }
                label={MIN_RATING_ENABLED_CHECKBOX_LABEL}
              />
              <FormHelperText>
                {MIN_RATING_ENABLED_CHECKBOX_HELP_TEXT}
              </FormHelperText>
              {values.minRatingEnabled && (
                <>
                  <TextField
                    variant="standard"
                    label={MIN_RATING_INPUT_LABEL}
                    name="minRating"
                    type="number"
                    margin="dense"
                    value={values.minRating}
                    onChange={handleChange}
                    error={Boolean(validationErrors.minRating)}
                  />
                  {validationErrors.minRating ? (
                    <FormHelperText error={true}>
                      {t(validationErrors.minRating, {
                        // TODO simplify when all data in component
                        rating: userStats?.TrueSkill?.Rating?.toFixed(2),
                      })}
                    </FormHelperText>
                  ) : null}
                  <FormHelperText>{MIN_RATING_INPUT_HELP_TEXT}</FormHelperText>
                </>
              )}
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    name="maxRatingEnabled"
                    checked={values.maxRatingEnabled}
                    onChange={handleChange}
                  />
                }
                label={MAX_RATING_ENABLED_CHECKBOX_LABEL}
              />
              <FormHelperText>
                {/* TODO errors should disable create button */}
                {MAX_RATING_ENABLED_CHECKBOX_HELP_TEXT}
              </FormHelperText>
              {values.maxRatingEnabled && (
                <>
                  <TextField
                    variant="standard"
                    label={MAX_RATING_INPUT_LABEL}
                    name="maxRating"
                    margin="dense"
                    type="number"
                    value={values.maxRating.toFixed(2)}
                    onChange={handleChange}
                    error={Boolean(validationErrors.maxRating)}
                  />
                  {validationErrors.maxRating ? (
                    <FormHelperText error={true}>
                      {t(validationErrors.maxRating, {
                        // TODO simplify when all data in component
                        rating: userStats?.TrueSkill?.Rating?.toFixed(2),
                      })}
                    </FormHelperText>
                  ) : null}
                  <FormHelperText>{MAX_RATING_INPUT_HELP_TEXT}</FormHelperText>
                </>
              )}
            </div>
          </section>
          <div className={classes.buttonContainer}>
            <Button type="submit" variant="contained" disabled={submitDisabled}>
              {CREATE_GAME_BUTTON_LABEL}
            </Button>
          </div>
        </form>
      </Container>
    </GoBackNav>
  );
};

export default CreateGame;
