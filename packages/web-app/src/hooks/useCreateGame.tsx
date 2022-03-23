import { FormikErrors, useFormik } from "formik";
import {
  createContext,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { randomGameName } from "../helpers";
import { CreateGameFormValues, UserStats, Variant } from "@diplicity/common";
import {
  diplicityService,
  uiActions,
  PageName,
  translateKeys as tk,
} from "@diplicity/common";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import usePageLoad from "./usePageLoad";

// TODO de-dupe with useSettings
const CLASSICAL = "Classical";
const {
  useGetRootQuery,
  useLazyGetUserStatsQuery,
  useLazyGetVariantSVGQuery,
  useListVariantsQuery,
} = diplicityService;

export interface IUseCreateGame {
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void;
  isLoading: boolean;
  randomizeName: () => void;
  selectedVariant: Variant | null;
  selectedVariantSVG: string | undefined;
  submitDisabled: boolean;
  userStats?: UserStats;
  validationErrors: FormikErrors<CreateGameFormValues>;
  values: CreateGameFormValues;
  variants: Variant[];
  isFetchingVariantSVG: boolean;
}

export const initialFormValues = {
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
};

const getInitialFormValues = (): CreateGameFormValues => initialFormValues;

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
        })
      );
    }
  }, [getUserStatsQuery.isSuccess, getUserStatsQuery.data?.TrueSkill?.Rating]);

  const {
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    errors: validationErrors,
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
    getVariantsSVGQuery.isFetching;
  const isLoading =
    listVariantsQuery.isLoading ||
    getUserStatsQuery.isLoading ||
    getVariantsSVGQuery.isLoading;

  return {
    handleChange,
    handleSubmit,
    randomizeName,
    selectedVariant,
    selectedVariantSVG: getVariantsSVGQuery.data,
    values,
    isFetchingVariantSVG: getVariantsSVGQuery.isFetching,
    variants: listVariantsQuery.data || [],
    userStats: getUserStatsQuery.data,
    validationErrors,
    submitDisabled,
    isLoading,
  };
};

export const useCreateGameContext = createContext<null | typeof useCreateGame>(
  null
);

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
