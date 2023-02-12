import React, { FormEvent } from "react";

import {
  Container,
  List,
  ListItem,
  FormControlLabel,
  FormHelperText,
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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import GoBackNav from "../components/GoBackNav";
import { iso639_1Codes } from "../helpers";
import { RandomGameNameIcon } from "../icons";
import { useCreateGame } from "@diplicity/common";
import Loading from "../components/Loading";
import {
  NationAllocation,
  nationAllocationTranslations,
} from "@diplicity/common";
import { useTranslation } from "react-i18next";
import { translateKeys as tk } from "@diplicity/common";
import { RouteConfig } from "./RouteConfig";
import ErrorMessage from "../components/ErrorMessage";
import NationPreferencesDialog, {
  searchKey,
} from "../components/NationPreferencesDialog.new";
import useSearchParams from "../hooks/useSearchParams";

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
    "& input": {
      minWidth: "250px",
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
  inputSelectContainer: {},
  inputSelectSelectWrapper: {},
}));

const CreateGame = (): React.ReactElement => {
  const { t } = useTranslation();
  const { setParam } = useSearchParams();
  const {
    createGameWithPreferences,
    error,
    handleChange,
    handleSubmit,
    isError,
    isFetchingVariantSVG,
    isLoading,
    randomizeName,
    percentages,
    selectedVariant,
    selectedVariantSVG,
    submitDisabled,
    userStats,
    validationErrors,
    values,
    variants,
  } = useCreateGame();

  const classes = useStyles();
  const singularPhaseLength = values.phaseLengthMultiplier === 1;
  const singularAdjustmentPhaseLength =
    values.adjustmentPhaseLengthMultiplier === 1;
  const minEndAfterYearsValue = (selectedVariant?.Start?.Year || 0) + 1;

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (values.nationAllocation === NationAllocation.Preference) {
      setParam(searchKey, values.variant);
    } else {
      handleSubmit();
    }
  };

  return (
    <>
      <GoBackNav title={t(tk.createGame.title)} href={RouteConfig.Home}>
        {isLoading ? (
          <Loading />
        ) : isError && error ? (
          <ErrorMessage error={error} />
        ) : (
          <Container className={classes.root}>
            <form onSubmit={onFormSubmit}>
              <section>
                <div className={classes.nameInputContainer}>
                  <TextField
                    variant="standard"
                    label={t(tk.createGame.nameInput.label)}
                    name="name"
                    id="name"
                    margin="dense"
                    value={values.name}
                    onChange={handleChange}
                  />
                  <IconButton
                    title={t(tk.createGame.randomizeGameNameButton.title)}
                    onClick={randomizeName}
                  >
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
                    label={t(tk.createGame.privateCheckbox.label) as string}
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
                    label={t(tk.createGame.gameMasterCheckbox.label) as string}
                  />
                  {values.privateGame ? (
                    <FormHelperText>
                      {t(tk.createGame.gameMasterCheckbox.helpText.default)}
                    </FormHelperText>
                  ) : (
                    <FormHelperText>
                      {t(tk.createGame.gameMasterCheckbox.helpText.disabled)}
                    </FormHelperText>
                  )}
                  {/* TODO TEST */}
                  {values.privateGame && values.gameMaster && (
                    <>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="requireGameMasterInvitation"
                            checked={values.requireGameMasterInvitation}
                            onChange={handleChange}
                            disabled={!values.gameMaster}
                          />
                        }
                        label={
                          t(
                            tk.createGame.requireGameMasterInvitation.label
                          ) as string
                        }
                      />
                      <FormHelperText>
                        {t(tk.createGame.requireGameMasterInvitation.helpText)}
                      </FormHelperText>
                    </>
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
                      <InputLabel htmlFor="variant-input-label">
                        {t(tk.createGame.variantSelect.label)}
                      </InputLabel>
                      <Select
                        id="variant-input-label"
                        value={values.variant}
                        name="variant"
                        onChange={(e) =>
                          handleChange(e as React.ChangeEvent<any>)
                        }
                        native
                      >
                        {variants.filter(variant => !variant.Name.includes('Beta')).map((variant) => (
                          <option
                            aria-checked={selectedVariant === variant}
                            key={variant.Name}
                            value={variant.Name}
                            title={variant.Name}
                          >
                            {t(tk.createGame.variantSelect.optionLabel, {
                              name: variant.Name,
                              numPlayers: variant.Nations.length,
                            })}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    {isFetchingVariantSVG ? (
                      <Loading />
                    ) : (
                      <>
                        <Typography className={classes.variantDescription}>
                          {selectedVariant.Description}
                        </Typography>
                        {selectedVariantSVG && (
                          <div
                            className={classes.variantSVGContainer}
                            dangerouslySetInnerHTML={{
                              __html: selectedVariantSVG,
                            }}
                          />
                        )}
                        <List className={classes.variantDetailList}>
                          <ListItem>
                            <Typography variant="caption">
                              {t(
                                tk.createGame.variantDescription.startYearLabel
                              )}
                            </Typography>
                            <Typography>
                              {selectedVariant.Start?.Year}
                            </Typography>
                          </ListItem>
                          <ListItem>
                            <Typography variant="caption">
                              {t(tk.createGame.variantDescription.authorLabel)}
                            </Typography>
                            <Typography>{selectedVariant.CreatedBy}</Typography>
                          </ListItem>
                          <ListItem>
                            <Typography variant="caption">
                              {t(tk.createGame.variantDescription.rulesLabel)}
                            </Typography>
                            <Typography>{selectedVariant.Rules}</Typography>
                          </ListItem>
                        </List>
                      </>
                    )}
                  </>
                ) : (
                  <Loading />
                )}
              </section>
              <section>
                <Typography>
                  {t(tk.createGame.nationAllocationSection.label)}
                </Typography>

                <RadioGroup
                  value={values.nationAllocation}
                  onChange={handleChange}
                  name="nationAllocation"
                  className={classes.nationAllocationContainer}
                >
                  <FormControlLabel
                    value={NationAllocation.Random}
                    control={<Radio />}
                    label={
                      t(
                        nationAllocationTranslations[NationAllocation.Random]
                      ) as string
                    }
                  />
                  <FormControlLabel
                    value={NationAllocation.Preference}
                    control={<Radio />}
                    label={
                      t(
                        nationAllocationTranslations[
                          NationAllocation.Preference
                        ]
                      ) as string
                    }
                  />
                </RadioGroup>
              </section>
              <section>
                <Typography>
                  {t(tk.createGame.gameLengthSection.label)}
                </Typography>

                <Box display="flex" className={classes.inputSelectContainer}>
                  <TextField
                    name="phaseLengthMultiplier"
                    id="phaseLengthMultiplier"
                    label={t(tk.createGame.phaseLengthMultiplierInput.label)}
                    type="number"
                    inputProps={{ min: 1 }}
                    value={values.phaseLengthMultiplier}
                    onChange={handleChange}
                    variant="standard"
                  />
                  <div className={classes.inputSelectSelectWrapper}>
                    <InputLabel id="phase-length-unit-input-label">
                      {t(tk.createGame.phaseLengthUnitSelect.label)}
                    </InputLabel>
                    <Select
                      name="phaseLengthUnit"
                      labelId="phase-length-unit-input-label"
                      value={values.phaseLengthUnit}
                      onChange={(e) =>
                        handleChange(e as React.ChangeEvent<any>)
                      }
                      variant="standard"
                    >
                      <MenuItem key={1} value={1}>
                        {singularPhaseLength
                          ? t(tk.durations.minute.singular)
                          : t(tk.durations.minute.plural)}
                      </MenuItem>
                      <MenuItem key={60} value={60}>
                        {singularPhaseLength
                          ? t(tk.durations.hour.singular)
                          : t(tk.durations.hour.plural)}
                      </MenuItem>
                      <MenuItem key={60 * 24} value={60 * 24}>
                        {singularPhaseLength
                          ? t(tk.durations.day.singular)
                          : t(tk.durations.day.plural)}
                      </MenuItem>
                    </Select>
                  </div>
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
                    label={
                      t(
                        tk.createGame.customAdjustmentPhaseLengthCheckbox.label
                      ) as string
                    }
                  />
                </div>
                {/* TODO componentize */}
                {values.customAdjustmentPhaseLength && (
                  <Box display="flex" className={classes.inputSelectContainer}>
                    <TextField
                      name="adjustmentPhaseLengthMultiplier"
                      id="adjustmentPhaseLengthMultiplier"
                      label={t(
                        tk.createGame.adjustmentPhaseLengthMultiplierInput.label
                      )}
                      type="number"
                      inputProps={{ min: 1 }}
                      value={values.adjustmentPhaseLengthMultiplier}
                      onChange={handleChange}
                      variant="standard"
                    />
                    <div className={classes.inputSelectSelectWrapper}>
                      <InputLabel id="adjustment-phase-length-unit-input-label">
                        {t(tk.createGame.adjustmentPhaseLengthUnitSelect.label)}
                      </InputLabel>
                      <Select
                        name="adjustmentPhaseLengthUnit"
                        labelId="adjustment-phase-length-unit-input-label"
                        value={values.adjustmentPhaseLengthUnit}
                        onChange={(e) =>
                          handleChange(e as React.ChangeEvent<any>)
                        }
                        variant="standard"
                      >
                        <MenuItem key={1} value={1}>
                          {singularAdjustmentPhaseLength
                            ? t(tk.durations.minute.singular)
                            : t(tk.durations.minute.plural)}
                        </MenuItem>
                        <MenuItem key={60} value={60}>
                          {singularAdjustmentPhaseLength
                            ? t(tk.durations.hour.singular)
                            : t(tk.durations.hour.plural)}
                        </MenuItem>
                        <MenuItem key={60 * 24} value={60 * 24}>
                          {singularAdjustmentPhaseLength
                            ? t(tk.durations.day.singular)
                            : t(tk.durations.day.plural)}
                        </MenuItem>
                      </Select>
                    </div>
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
                    label={
                      t(tk.createGame.skipGetReadyPhaseCheckbox.label) as string
                    }
                  />
                </div>
                <FormHelperText>
                  {t(tk.createGame.skipGetReadyPhaseCheckbox.helpText)}
                </FormHelperText>
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="endAfterYears"
                        checked={values.endAfterYears}
                        onChange={handleChange}
                      />
                    }
                    label={
                      t(tk.createGame.endAfterYearsCheckbox.label) as string
                    }
                  />
                </div>
                {values.endAfterYears && (
                  <TextField
                    name="endAfterYearsValue"
                    id="endAfterYearsValue"
                    label={t(tk.createGame.endAfterYearsInput.label)}
                    type="number"
                    inputProps={{ min: minEndAfterYearsValue }}
                    value={values.endAfterYearsValue}
                    onChange={handleChange}
                    variant="standard"
                  />
                )}
              </section>
              <section>
                <Typography>{t(tk.createGame.chatSection.label)}</Typography>
                <Typography variant="caption">
                  {t(tk.createGame.allowChatsSwitch.label)}
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="conferenceChatEnabled"
                        checked={values.conferenceChatEnabled}
                        onChange={handleChange}
                      />
                    }
                    label={
                      t(tk.createGame.conferenceChatCheckbox.label) as string
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="groupChatEnabled"
                        checked={values.groupChatEnabled}
                        onChange={handleChange}
                      />
                    }
                    label={t(tk.createGame.groupChatCheckbox.label) as string}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="individualChatEnabled"
                        checked={values.individualChatEnabled}
                        onChange={handleChange}
                      />
                    }
                    label={
                      t(tk.createGame.individualChatCheckbox.label) as string
                    }
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
                    label={
                      t(tk.createGame.anonymousChatCheckbox.label) as string
                    }
                  />
                  {!values.privateGame && (
                    <FormHelperText>
                      {t(tk.createGame.anonymousChatCheckbox.explanation)}
                    </FormHelperText>
                  )}
                </FormGroup>
                <FormControl variant="standard">
                  <InputLabel id="chat-language-input-label">
                    {t(tk.createGame.chatLanguageSelect.label)}
                  </InputLabel>
                  <Select
                    labelId="chat-language-input-label"
                    id="chatLanguage"
                    name="chatLanguage"
                    value={values.chatLanguage}
                    onChange={(e) => handleChange(e as React.ChangeEvent<any>)}
                  >
                    <MenuItem value="players_choice">
                      {t(tk.createGame.chatLanguageSelect.defaultOption)}
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
                <Typography>
                  {t(tk.createGame.requirementsSection.label)}
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
                    label={
                      t(
                        tk.createGame.reliabilityEnabledCheckbox.label
                      ) as string
                    }
                  />
                  <FormHelperText>
                    {t(tk.createGame.reliabilityEnabledCheckbox.helpText)}
                  </FormHelperText>
                  {values.reliabilityEnabled && (
                    <>
                      <TextField
                        variant="standard"
                        label={
                          t(tk.createGame.minReliabilityInput.label) as string
                        }
                        name="minReliability"
                        id="minReliability"
                        type="number"
                        margin="dense"
                        value={values.minReliability}
                        onChange={handleChange}
                      />
                      {validationErrors.minReliability ? (
                        <FormHelperText error={true}>
                          {t(validationErrors.minReliability, {
                            // TODO simplify when all data in component
                            reliability: userStats?.Reliability?.toFixed(2),
                          })}
                        </FormHelperText>
                      ) : null}
                    </>
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
                    label={
                      t(tk.createGame.quicknessEnabledCheckbox.label) as string
                    }
                  />
                  <FormHelperText>
                    {t(tk.createGame.quicknessEnabledCheckbox.helpText)}
                  </FormHelperText>
                  {values.quicknessEnabled && (
                    <>
                      <TextField
                        variant="standard"
                        label={
                          t(tk.createGame.minQuicknessInput.label) as string
                        }
                        name="minQuickness"
                        id="minQuickness"
                        type="number"
                        margin="dense"
                        value={values.minQuickness}
                        onChange={handleChange}
                      />
                      {validationErrors.minQuickness ? (
                        <FormHelperText error={true}>
                          {t(validationErrors.minQuickness, {
                            // TODO simplify when all data in component
                            quickness: userStats?.Quickness?.toFixed(2),
                          })}
                        </FormHelperText>
                      ) : null}
                    </>
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
                    label={
                      t(tk.createGame.minRatingEnabledCheckbox.label) as string
                    }
                  />
                  <FormHelperText>
                    {t(tk.createGame.minRatingEnabledCheckbox.helpText)}
                  </FormHelperText>
                  {values.minRatingEnabled && (
                    <>
                      <TextField
                        variant="standard"
                        label={t(tk.createGame.minRatingInput.label) as string}
                        name="minRating"
                        id="minRating"
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
                      <FormHelperText>
                        {t(tk.createGame.minRatingInput.helpText, {
                          // TODO test
                          percentage: percentages.minPercentage,
                        })}
                      </FormHelperText>
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
                    label={
                      t(tk.createGame.maxRatingEnabledCheckbox.label) as string
                    }
                  />
                  <FormHelperText>
                    {/* TODO errors should disable create button */}
                    {t(tk.createGame.maxRatingEnabledCheckbox.helpText)}
                  </FormHelperText>
                  {values.maxRatingEnabled && (
                    <>
                      <TextField
                        variant="standard"
                        label={t(tk.createGame.maxRatingInput.label) as string}
                        id="maxRating"
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
                      <FormHelperText>
                        {t(tk.createGame.maxRatingInput.helpText, {
                          // TODO test
                          percentage: percentages.maxPercentage,
                        })}
                      </FormHelperText>
                    </>
                  )}
                </div>
              </section>
              <div className={classes.buttonContainer}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitDisabled}
                >
                  {t(tk.createGame.submitButton.label)}
                </Button>
              </div>
            </form>
          </Container>
        )}
      </GoBackNav>
      <NationPreferencesDialog handleSubmit={createGameWithPreferences} />
    </>
  );
};

export default CreateGame;
