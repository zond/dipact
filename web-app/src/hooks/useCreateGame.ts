import { FormikErrors, FormikTouched, useFormik } from "formik";
import { FormEvent, useEffect, useState } from "react";
import Globals from "../Globals";
import { randomGameName } from "../helpers";
import {
  ColorOverrides,
  CreateGameFormValues,
  SettingsFormValues,
  UserConfig,
  UserStats,
  Variant,
} from "../store/types";
import { useColorOverrides } from "./selectors";
import {
  useGetRootQuery,
  useGetUserRatingHistogramQuery,
  useLazyGetUserConfigQuery,
  useLazyGetUserStatsQuery,
  useLazyGetVariantSVGQuery,
  useListVariantsQuery,
} from "./service";
import { actions as uiActions } from "../store/ui";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import tk from "../translations/translateKeys";

// TODO de-dupe with useSettings
const CLASSICAL = "Classical";

interface IUseCreateGame {
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void;
  randomizeName: () => void;
  selectedVariant: Variant | null;
  selectedVariantSVG: string | undefined;
  values: CreateGameFormValues;
  variants: Variant[];
  touched: FormikTouched<CreateGameFormValues>;
  userStats?: UserStats;
  validationErrors: FormikErrors<CreateGameFormValues>;
}

const getInitialFormValues = (): CreateGameFormValues => ({
  nationAllocation: 0,
  name: randomGameName(),
  privateGame: false,
  gameMaster: false,
  variant: "",
  phaseLengthMultiplier: 1,
  phaseLengthUnit: 60,
  customAdjustmentPhaseLength: false,
  adjustmentPhaseLengthMultiplier: 1,
  adjustmentPhaseLengthUnit: 60,
  skipGetReadyPhase: true,
  endAfterYears: false,
  endAfterYearsValue: 1,
  conferenceChatEnabled: true,
  groupChatEnabled: true,
  individualChatEnabled: true,
  anonymousEnabled: false,
  chatLanguage: "players_choice",
  minReliability: 0,
  reliabilityEnabled: true,
  minQuickness: 0,
  quicknessEnabled: true,
  minRatingEnabled: false,
  minRating: 0,
  maxRatingEnabled: false,
  maxRating: 0,
});

const useCreateGame = (): IUseCreateGame => {
  const [
    triggerGetVariantSVGQuery,
    getVariantsSVGQuery,
  ] = useLazyGetVariantSVGQuery();
  const listVariantsQuery = useListVariantsQuery(undefined);
  const getRootQuery = useGetRootQuery(undefined);
  const [getUserStatsTrigger, getUserStatsQuery] = useLazyGetUserStatsQuery();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [validationSchema, setValidationSchema] = useState<any>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (getRootQuery.data) {
      getUserStatsTrigger(getRootQuery.data.Id as string);
    }
  }, [getRootQuery, getUserStatsTrigger]);

  useEffect(() => {
    if (getUserStatsQuery.isSuccess) {
      setValidationSchema(
        yup.object().shape({
          maxRating: yup
            .number()
            .min(
              (getUserStatsQuery.data.TrueSkill?.Rating || 0) - 0.01 as number,
              tk.CreateGameMaxRatingInputErrorMessageLessThanUserRating
            ),
          minRating: yup
            .number()
            .max(
              getUserStatsQuery.data.TrueSkill?.Rating as number,
              tk.CreateGameMinRatingInputErrorMessageMoreThanUserRating
            ),
        })
      );
    }
  }, [getUserStatsQuery.isSuccess, getUserStatsQuery.data?.TrueSkill?.Rating]);

  const {
    values,
    handleChange,
    handleSubmit,
    resetForm,
    initialValues,
    setFieldValue,
    errors: validationErrors,
    touched,
  } = useFormik({
    initialValues: getInitialFormValues(),
    onSubmit: (vals) => {
      dispatch(uiActions.submitCreateGameForm(vals));
    },
    validationSchema,
  });

  useEffect(() => {
    if (getUserStatsQuery.isSuccess) {
      if (values.maxRating === 0)
        setFieldValue(
          "maxRating",
          getUserStatsQuery.data.TrueSkill?.Rating as number
        );
    }
  }, [getRootQuery, getUserStatsQuery, setFieldValue, values.maxRating]);

  useEffect(() => {
    if (listVariantsQuery.isSuccess && listVariantsQuery.data) {
      const defaultVariant = listVariantsQuery.data.find(
        (variant) => variant.Name === CLASSICAL
      );
      if (defaultVariant) {
        setSelectedVariant(defaultVariant);
        setFieldValue("variant", defaultVariant.Name);
      }
    }
  }, [listVariantsQuery, setFieldValue]);

  useEffect(() => {
    if (selectedVariant) {
      triggerGetVariantSVGQuery(selectedVariant.Name);
      setFieldValue(
        "endAfterYearsValue",
        (selectedVariant.Start?.Year || 0) + 8
      );
    }
  }, [selectedVariant, triggerGetVariantSVGQuery, setFieldValue]);

  const randomizeName = () => setFieldValue("name", randomGameName());

  return {
    handleChange,
    handleSubmit,
    randomizeName,
    selectedVariant,
    selectedVariantSVG: getVariantsSVGQuery.data,
    values,
    variants: listVariantsQuery.data || [],
    touched,
    userStats: getUserStatsQuery.data,
    validationErrors,
  };
};

export default useCreateGame;
