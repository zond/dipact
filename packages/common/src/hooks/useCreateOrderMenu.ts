import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { CreateOrderStep, selectors, uiActions } from "../store";
import { translateKeys as tk } from "../translations";

interface ICreateOrderMenu {
  options: { label: string; value: string }[] | undefined;
  orderSummary: string;
  orderPrompt: string;
  handleSelectOption: (option: string) => void;
}

const promptMap = {
  [CreateOrderStep.SelectAux]: tk.createOrder.prompt.selectAux,
  [CreateOrderStep.SelectSource]: tk.createOrder.prompt.selectSource,
  [CreateOrderStep.SelectTarget]: tk.createOrder.prompt.selectTarget,
  [CreateOrderStep.SelectType]: tk.createOrder.prompt.selectType,
  [CreateOrderStep.SelectAuxTarget]: tk.createOrder.prompt.selectAuxTarget,
  [CreateOrderStep.Complete]: "",
};

const summaryMap = {
  [CreateOrderStep.SelectAux]: tk.createOrder.summary.selectAux,
  [CreateOrderStep.SelectSource]: "",
  [CreateOrderStep.SelectTarget]: tk.createOrder.summary.selectTarget,
  [CreateOrderStep.SelectType]: tk.createOrder.summary.selectType,
  [CreateOrderStep.SelectAuxTarget]: tk.createOrder.summary.selectAuxTarget,
  [CreateOrderStep.Complete]: "",
};

const useCreateOrderMenu = (close: () => void): ICreateOrderMenu => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const options = useSelector(selectors.selectCreateOrderOptions);
  const step = useSelector(selectors.selectCreateOrderStep);
  const { source, aux, target, type } = useSelector(
    selectors.selectCreateOrderDisplay
  );
  const [started, setStarted] = useState(false);
  const summary = summaryMap[step];
  const prompt = promptMap[step];

  useEffect(() => {
    if (source) {
      setStarted(true);
    }
  }, [source]);

  useEffect(() => {
    if (started && !source) {
      close();
      setStarted(false);
    }
  }, [close, started, source]);

  return {
    options,
    orderSummary: t(prompt, { source, aux, target, type }),
    orderPrompt: t(summary, { source, aux, target, type }),
    handleSelectOption: (option: string) => {
      dispatch(uiActions.selectCreateOrderOption(option));
    },
  };
};

export default useCreateOrderMenu;
