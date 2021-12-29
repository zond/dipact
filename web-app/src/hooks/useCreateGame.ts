import { useFormik } from "formik";
import { FormEvent, useEffect, useState } from "react";
import Globals from "../Globals";
import { randomGameName } from "../helpers";
import {
  ColorOverrides,
  SettingsFormValues,
  UserConfig,
  Variant,
} from "../store/types";
import { useColorOverrides } from "./selectors";
import {
  useGetRootQuery,
  useLazyGetUserConfigQuery,
  useLazyGetVariantSVGQuery,
  useListVariantsQuery,
} from "./service";

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
}

interface CreateGameFormValues {
  name: string;
  privateGame: boolean;
  gameMaster: boolean;
  variant: string;
  nationAllocation: number;
  phaseLengthMultiplier: number;
  phaseLengthUnit: number;
  customAdjustmentPhaseLength: boolean;
  adjustmentPhaseLengthMultiplier: number;
  adjustmentPhaseLengthUnit: number;
  skipGetReadyPhase: boolean;
  endAfterYears: boolean;
  endAfterYearsValue: number;
  conferenceChatEnabled: boolean;
  groupChatEnabled: boolean;
  individualChatEnabled: boolean;
  anonymousEnabled: boolean;
  chatLanguage: string;
  reliabilityEnabled: boolean;
  minReliability: number;
  quicknessEnabled: boolean;
  minQuickness: number;
  minRatingEnabled: boolean;
  minRating: number;
  maxRatingEnabled: boolean;
  maxRating: number;
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
  maxRating: 0, // TODO set default to user rating
});

const useCreateGame = (): IUseCreateGame => {
  const [
    triggerGetVariantSVGQuery,
    getVariantsSVGQuery,
  ] = useLazyGetVariantSVGQuery();
  const listVariantsQuery = useListVariantsQuery(undefined);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const {
    values,
    handleChange,
    handleSubmit,
    resetForm,
    initialValues,
    setFieldValue,
  } = useFormik({
    initialValues: getInitialFormValues(),
    onSubmit: (vals) => {
      console.log(vals);
      // dispatch(submitCreateGameForm(vals));
    },
  });

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
  };
};

export default useCreateGame;
