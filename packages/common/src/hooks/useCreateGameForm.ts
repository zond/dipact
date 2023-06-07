import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { CreateGameFormValues, NationAllocation } from "../store";
import { randomGameName } from "../utils/general";
import { translateKeys as tk } from "../translations";
import useCreateGameView from "./useCreateGameView";

const initialFormValues = {
  adjustmentPhaseLengthMultiplier: 1,
  adjustmentPhaseLengthUnit: 60 * 24,
  anonymousEnabled: false,
  chatLanguage: "players_choice",
  conferenceChatEnabled: true,
  customAdjustmentPhaseLength: false,
  endAfterYears: false,
  endAfterYearsValue: 1,
  gameMaster: false,
  groupChatEnabled: true,
  individualChatEnabled: true,
  maxRating: 0,
  maxRatingEnabled: false,
  minQuickness: 0,
  minRating: 0,
  minRatingEnabled: false,
  minReliability: 0,
  name: randomGameName(),
  nationAllocation: NationAllocation.Random,
  phaseLengthMultiplier: 1,
  phaseLengthUnit: 60 * 24,
  privateGame: false,
  quicknessEnabled: true,
  reliabilityEnabled: true,
  requireGameMasterInvitation: false,
  skipGetReadyPhase: true,
  variant: "Classical",
};

const getInitialFormValues = (): CreateGameFormValues => initialFormValues;

const useCreateGame = () => {
  const { query, actions } = useCreateGameView();
  const [createGame, createGameStatus] = actions.createGame;
  const [validationSchema, setValidationSchema] = useState<any>();

  const {
    values,
    handleChange,
    handleSubmit,
    submitForm,
    setFieldValue,
    errors: validationErrors,
  } = useFormik({
    initialValues: getInitialFormValues(),
    onSubmit: (v) => createGame(v),
    validationSchema,
  });

  const selectedVariant = query.data?.variants?.find(
    (v) => v.name === values.variant
  );

  useEffect(() => {
    if (selectedVariant) {
      setValidationSchema(
        yup.object().shape({
          endAfterYearsValue: yup
            .number()
            .min(
              selectedVariant.startYear,
              tk.createGame.endAfterYearsInput.errorMessage.lessThanVariantStart
            ),
        })
      );
    }
  }, [selectedVariant]);

  const randomizeName = () => setFieldValue("name", randomGameName());
  const submitDisabled = createGameStatus.isLoading;

  return {
    handleChange,
    handleSubmit,
    query,
    randomizeName,
    setFieldValue,
    submitDisabled,
    submitForm,
    validationErrors,
    values,
  };
};

export default useCreateGame;
