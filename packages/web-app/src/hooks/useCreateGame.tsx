import { FormikErrors, useFormik } from "formik";
import {
  createContext,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { randomGameName } from "../helpers";
import { CreateGameFormValues, MutationStatus, selectors, UserStats, Variant } from "@diplicity/common";
import {
  diplicityService,
  uiActions,
  PageName,
  translateKeys as tk,
} from "@diplicity/common";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import usePageLoad from "./usePageLoad";
import { mergeErrors } from "./utils";
import { ApiError } from "./types";
import { useAppSelector } from "./useAppSelector";

const {
  useGetRootQuery,
  useLazyGetUserStatsQuery,
  useLazyGetVariantSVGQuery,
  useListVariantsQuery,
} = diplicityService;

// TODO de-dupe with useSettings
const CLASSICAL = "Classical";

export interface IUseCreateGame {
  error: ApiError | null;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void;
  isError: boolean;
  isFetchingVariantSVG: boolean;
  isLoading: boolean;
  randomizeName: () => void;
  selectedVariant: Variant | null;
  selectedVariantSVG: string | undefined;
  submitDisabled: boolean;
  userStats?: UserStats;
  validationErrors: FormikErrors<CreateGameFormValues>;
  values: CreateGameFormValues;
  variants: Variant[];
}

export const initialFormValues = {
  adjustmentPhaseLengthMultiplier: 1,
  adjustmentPhaseLengthUnit: 60,
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
  nationAllocation: 0,
  phaseLengthMultiplier: 1,
  phaseLengthUnit: 60,
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
  useAppSelector(selectors.selectCreateGameStatus);

const useCreateGame = (): IUseCreateGame => {
  const getRootQuery = useGetRootQuery(undefined);
  const listVariantsQuery = useListVariantsQuery(undefined);
  const [triggerGetVariantSVGQuery, getVariantsSVGQuery] =
    useLazyGetVariantSVGQuery();
  const [getUserStatsTrigger, getUserStatsQuery] = useLazyGetUserStatsQuery();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [validationSchema, setValidationSchema] = useState<any>();
  const dispatch = useDispatch();
  usePageLoad(PageName.CreateGame);

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
    setFieldValue,
    errors: validationErrors,
  } = useFormik({
    initialValues: getInitialFormValues(),
    onSubmit: (values) => {
      dispatch(uiActions.submitCreateGameForm(values));
    },
    validationSchema,
  });

  const { isLoading: createGameIsLoading } = useCreateGameStatus();

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
        listVariantsQuery.error as ApiError,
        getUserStatsQuery.error as ApiError,
        getVariantsSVGQuery.error as ApiError
      )
    : null;

  return {
    error,
    handleChange,
    handleSubmit,
    isError,
    isFetchingVariantSVG: getVariantsSVGQuery.isFetching,
    isLoading,
    randomizeName,
    selectedVariant,
    selectedVariantSVG: getVariantsSVGQuery.data,
    submitDisabled,
    userStats: getUserStatsQuery.data,
    validationErrors,
    values,
    variants: listVariantsQuery.data || [],
  };
};

export const useCreateGameContext =
  createContext<null | typeof useCreateGame>(null);

const createDIContext = <T,>() => createContext<null | T>(null);
export const useDIContext = createDIContext<typeof useCreateGame>();

const useGetHook = () => useContext(useDIContext) || useCreateGame;
const useDIHook = (): IUseCreateGame => useGetHook()();

export const createGameDecorator = (values: IUseCreateGame) => {
  return (Component: () => JSX.Element) => (
    <useDIContext.Provider value={() => values}>
      <Component />
    </useDIContext.Provider>
  );
};

export default useDIHook;