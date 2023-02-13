import { FormikErrors, useFormik } from "formik";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import {
  diplicityService,
  CreateGameFormValues,
  MutationStatus,
  NationAllocation,
  PageName,
  UserRatingHistogram,
  UserStats,
  Variant,
  selectors,
  uiActions,
  DiplicityError,
} from "../store";
import { mergeErrors, randomGameName } from "../utils/general";
import { translateKeys as tk } from "../translations";
import usePageLoad from "./usePageLoad";

const {
  useGetRootQuery,
  useLazyGetUserStatsQuery,
  useLazyGetVariantSVGQuery,
  useListVariantsQuery,
} = diplicityService;

// TODO de-dupe with useSettings
const CLASSICAL = "Classical";

export interface IUseCreateGame {
  createGameWithPreferences: (preferences: string[]) => void;
  error: DiplicityError | null;
  handleChange: (e: string | React.ChangeEvent<any>) => void;
  handleSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void;
  isError: boolean;
  isFetchingVariantSVG: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  randomizeName: () => void;
  percentages: { minPercentage: number; maxPercentage: number };
  selectedVariant: Variant | null;
  selectedVariantSVG: string | undefined;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<CreateGameFormValues>>;
  submitDisabled: boolean;
  submitForm: () => Promise<void>;
  userStats?: UserStats;
  validationErrors: FormikErrors<CreateGameFormValues>;
  values: CreateGameFormValues;
  variants: Variant[];
}

export const initialFormValues = {
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
  variant: "",
};

const getInitialFormValues = (): CreateGameFormValues => initialFormValues;

// TODO move somewhere else
export const useCreateGameStatus = (): MutationStatus =>
  useSelector(selectors.selectCreateGameStatus);

const useCreateGame = (): IUseCreateGame => {
  usePageLoad(PageName.CreateGame);

  const getRootQuery = useGetRootQuery(undefined);
  const getUserRatingHistogramQuery =
    diplicityService.useGetUserRatingHistogramQuery(undefined);
  const listVariantsQuery = useListVariantsQuery(undefined);
  const [triggerGetVariantSVGQuery, getVariantsSVGQuery] =
    useLazyGetVariantSVGQuery();
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
          minReliability: yup
            .number()
            .max(
              getUserStatsQuery.data.Reliability as number,
              tk.createGame.minReliabilityInput.errorMessage
                .moreThanUserReliability
            ),
          minQuickness: yup
            .number()
            .max(
              getUserStatsQuery.data.Quickness as number,
              tk.createGame.minQuicknessInput.errorMessage.moreThanUserQuickness
            ),
          maxRating: yup
            .number()
            .min(
              ((getUserStatsQuery.data.TrueSkill?.Rating || 0) -
                0.01) as number,
              tk.createGame.maxRatingInput.errorMessage.lessThanUserRating
            ),
          minRating: yup
            .number()
            .max(
              getUserStatsQuery.data.TrueSkill?.Rating as number,
              tk.createGame.minRatingInput.errorMessage.moreThanUserRating
            ),
          endAfterYearsValue: yup
            .number()
            .min(
              selectedVariant?.Start?.Year as number,
              tk.createGame.endAfterYearsInput.errorMessage.lessThanVariantStart
            ),
        })
      );
    }
  }, [
    getUserStatsQuery.isSuccess,
    getUserStatsQuery.data?.TrueSkill?.Rating,
    selectedVariant,
    getUserStatsQuery.data?.Reliability,
    getUserStatsQuery.data?.Quickness,
  ]);

  const {
    values,
    handleChange,
    handleSubmit,
    submitForm,
    setFieldValue,
    errors: validationErrors,
  } = useFormik({
    initialValues: getInitialFormValues(),
    onSubmit: (values) => {
      dispatch(uiActions.submitCreateGameForm(values));
    },
    validationSchema,
  });

  const { isLoading: createGameIsLoading, isSuccess } = useCreateGameStatus();

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
    if (listVariantsQuery.data) {
      const newVariant = listVariantsQuery.data.find(
        (variant) => variant.Name === values.variant
      );
      if (newVariant) {
        setSelectedVariant(newVariant);
      }
    }
  }, [values.variant, listVariantsQuery.data]);

  useEffect(() => {
    if (selectedVariant) {
      triggerGetVariantSVGQuery(selectedVariant.Name);
      setFieldValue(
        "endAfterYearsValue",
        (selectedVariant.Start?.Year || 0) + 8
      );
    }
  }, [selectedVariant, triggerGetVariantSVGQuery, setFieldValue]);

  // TODO move to selectors/transformers
  const [percentages, setPercentages] = useState<{
    minPercentage: number;
    maxPercentage: number;
  }>({ minPercentage: 0, maxPercentage: 0 });
  const ratingPercentile = (
    userRatingHistogram: UserRatingHistogram,
    rating: number
  ): number => {
    let totalCount = 0;
    let belowCount = 0;
    userRatingHistogram.Counts.forEach((count, idx) => {
      totalCount += count;
      if (idx + userRatingHistogram.FirstBucketRating < rating) {
        belowCount += count;
      }
    });
    return Math.floor(100 - 100 * (belowCount / totalCount));
  };
  useEffect(() => {
    if (getUserRatingHistogramQuery.isSuccess) {
      const minPercentage =
        100 -
        ratingPercentile(getUserRatingHistogramQuery.data, values.minRating);
      const maxPercentage = ratingPercentile(
        getUserRatingHistogramQuery.data,
        values.maxRating
      );
      setPercentages({ minPercentage, maxPercentage });
    }
  }, [getUserRatingHistogramQuery, values.maxRating, values.minRating]);

  const randomizeName = () => setFieldValue("name", randomGameName());
  const submitDisabled =
    Object.keys(validationErrors).length !== 0 ||
    getVariantsSVGQuery.isFetching ||
    createGameIsLoading;
  const isLoading =
    listVariantsQuery.isLoading ||
    getUserStatsQuery.isLoading ||
    getVariantsSVGQuery.isLoading;
  const isError =
    listVariantsQuery.isError ||
    getUserStatsQuery.isError ||
    getVariantsSVGQuery.isError;
  const error = isError
    ? mergeErrors(
        listVariantsQuery.error as DiplicityError,
        getUserStatsQuery.error as DiplicityError,
        getVariantsSVGQuery.error as DiplicityError
      )
    : null;

  const createGameWithPreferences = (preferences: string[]) => {
    dispatch(
      uiActions.submitCreateGameFormWithPreferences({ values, preferences })
    );
  };

  // Exclude beta variants from CreateGame - they can be created at https://diplicity-engine.appspot.com
  const variants =
    listVariantsQuery.data?.filter((v) => !v.Name.includes("Beta")) || [];

  return {
    createGameWithPreferences,
    error,
    handleChange,
    handleSubmit,
    isError,
    isFetchingVariantSVG: getVariantsSVGQuery.isFetching,
    isLoading,
    isSuccess,
    randomizeName,
    percentages,
    selectedVariant,
    selectedVariantSVG: getVariantsSVGQuery.data,
    setFieldValue,
    submitDisabled,
    submitForm,
    userStats: getUserStatsQuery.data,
    validationErrors,
    values,
    variants,
  };
};

export default useCreateGame;
