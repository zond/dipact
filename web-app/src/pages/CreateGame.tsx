import React from "react";

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
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import GoBackNav from "../components/GoBackNav";
import { iso639_1Codes } from "../helpers";
import { RandomGameNameIcon } from "../icons";
import useCreateGame from "../hooks/useCreateGame";
import Loading from "../components/Loading";
import {
  nationAllocationMap,
  nationAllocationTranslations,
} from "../hooks/useGameList";
import { useTranslation } from "react-i18next";
import { translateKeys as tk } from "@diplicity/common";

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

const CreateGame = (): React.ReactElement => {
  const { t } = useTranslation();
  const {
    handleChange,
    handleSubmit,
    isLoading,
    randomizeName,
    selectedVariant,
    selectedVariantSVG,
    submitDisabled,
    userStats,
    values,
    variants,
    isFetchingVariantSVG,
    validationErrors,
  } = useCreateGame();

  const classes = useStyles();
  const singularPhaseLength = values.phaseLengthMultiplier === 1;
  const singularAdjustmentPhaseLength =
    values.adjustmentPhaseLengthMultiplier === 1;
  const minEndAfterYearsValue = (selectedVariant?.Start?.Year || 0) + 1;

  // TODO do properly
  const maxPercentage = 10;
  const minPercentage = 10;

  return (
    <GoBackNav title={t(tk.createGame.title)}>
      {isLoading ? (
        <Loading />
      ) : (
        <Container className={classes.root}>
          <form onSubmit={handleSubmit}>
            <section>
              <div className={classes.nameInputContainer}>
                <TextField
                  variant="standard"
                  label={t(tk.createGame.nameInput.label)}
                  name="name"
                  margin="dense"
                  value={values.name}
                  onChange={handleChange}
                />
                <IconButton
                  title={t(tk.createGame.randomizeGameNameButton.title)}
                  onClick={randomizeName}
                  size="large"
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
                      {variants.map((variant) => (
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
                            {t(tk.createGame.variantDescription.startYearLabel)}
                          </Typography>
                          <Typography>{selectedVariant.Start?.Year}</Typography>
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
              <Typography variant="caption">
                {t(tk.createGame.nationAllocationSection.label)}
              </Typography>

              <RadioGroup
                value={values.nationAllocation}
                onChange={handleChange}
                name="nationAllocation"
                className={classes.nationAllocationContainer}
              >
                <FormControlLabel
                  value={0}
                  control={<Radio />}
                  label={
                    t(
                      nationAllocationTranslations[nationAllocationMap[0]]
                    ) as string
                  }
                />
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label={
                    t(
                      nationAllocationTranslations[nationAllocationMap[1]]
                    ) as string
                  }
                />
              </RadioGroup>
            </section>
            <section>
              <Typography variant="caption">
                {t(tk.createGame.gameLengthSection.label)}
              </Typography>

              <Box display="flex">
                <TextField
                  name="phaseLengthMultiplier"
                  label={t(tk.createGame.phaseLengthMultiplierInput.label)}
                  type="number"
                  inputProps={{ min: 1 }}
                  value={values.phaseLengthMultiplier}
                  onChange={handleChange}
                  variant="standard"
                />
                <InputLabel id="phase-length-unit-input-label">
                  {t(tk.createGame.phaseLengthUnitSelect.label)}
                </InputLabel>
                <Select
                  name="phaseLengthUnit"
                  labelId="phase-length-unit-input-label"
                  value={values.phaseLengthUnit}
                  onChange={(e) => handleChange(e as React.ChangeEvent<any>)}
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
                <Box display="flex">
                  <TextField
                    name="adjustmentPhaseLengthMultiplier"
                    label={t(
                      tk.createGame.adjustmentPhaseLengthMultiplierInput.label
                    )}
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
                        ? t(tk.durations.day.plural)
                        : t(tk.durations.day.plural)}
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
                  label={t(tk.createGame.endAfterYearsCheckbox.label) as string}
                />
              </div>
              {values.endAfterYears && (
                <TextField
                  name="endAfterYearsValue"
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
              <Typography variant="caption">
                {t(tk.createGame.chatSection.label)}
              </Typography>
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
                  label={t(tk.createGame.anonymousChatCheckbox.label) as string}
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
              <Typography variant="caption">
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
                    t(tk.createGame.reliabilityEnabledCheckbox.label) as string
                  }
                />
                <FormHelperText>
                  {t(tk.createGame.reliabilityEnabledCheckbox.helpText)}
                </FormHelperText>
                {values.reliabilityEnabled && (
                  <TextField
                    variant="standard"
                    label={t(tk.createGame.minReliabilityInput.label) as string}
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
                  label={
                    t(tk.createGame.quicknessEnabledCheckbox.label) as string
                  }
                />
                <FormHelperText>
                  {t(tk.createGame.quicknessEnabledCheckbox.helpText)}
                </FormHelperText>
                {values.quicknessEnabled && (
                  <TextField
                    variant="standard"
                    label={t(tk.createGame.minQuicknessInput.label) as string}
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
                        percentage: minPercentage,
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
                        percentage: maxPercentage,
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
                disabled={submitDisabled}
              >
                {t(tk.createGame.submitButton.label)}
              </Button>
            </div>
          </form>
        </Container>
      )}
    </GoBackNav>
  );
};

export default CreateGame;
