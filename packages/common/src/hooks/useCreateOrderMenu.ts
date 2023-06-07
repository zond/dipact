// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";

// import { CreateOrderStep, selectors, uiActions } from "../store";
// import { translateKeys as tk } from "../translations";

// interface ICreateOrderMenu {
//   options: { label: string; value: string }[] | undefined;
//   orderSummary: string;
//   orderPrompt: string;
//   handleSelectOption: (option: string) => void;
// }

// const promptMap = {
//   [CreateOrderStep.SelectAux]: tk.createOrder.prompt.selectAux,
//   [CreateOrderStep.SelectSource]: tk.createOrder.prompt.selectSource,
//   [CreateOrderStep.SelectTarget]: tk.createOrder.prompt.selectTarget,
//   [CreateOrderStep.SelectType]: tk.createOrder.prompt.selectType,
//   [CreateOrderStep.SelectAuxTarget]: tk.createOrder.prompt.selectAuxTarget,
//   [CreateOrderStep.Complete]: "",
// };

// const summaryMap = {
//   [CreateOrderStep.SelectAux]: tk.createOrder.summary.selectAux,
//   [CreateOrderStep.SelectSource]: "",
//   [CreateOrderStep.SelectTarget]: tk.createOrder.summary.selectTarget,
//   [CreateOrderStep.SelectType]: tk.createOrder.summary.selectType,
//   [CreateOrderStep.SelectAuxTarget]: tk.createOrder.summary.selectAuxTarget,
//   [CreateOrderStep.Complete]: "",
// };

// const useCreateOrderMenu = (close: () => void): ICreateOrderMenu => {
//   console.log("useCreateOrderMenu called", JSON.stringify(close));
//   const dispatch = useDispatch();
//   const { t } = useTranslation();
//   const options = useSelector(selectors.selectCreateOrderOptions);
//   console.log("useCreateOrderMenu options", JSON.stringify(options));
//   const step = useSelector(selectors.selectCreateOrderStep);
//   console.log("useCreateOrderMenu step", JSON.stringify(step));
//   const createOrderDisplay = useSelector(selectors.selectCreateOrderDisplay);
//   console.log("useCreateOrderMenu display", JSON.stringify(createOrderDisplay));
//   const [started, setStarted] = useState(false);
//   console.log("useCreateOrderMenu started", started);
//   const summary = summaryMap[step];
//   console.log("useCreateOrderMenu summary", summary);
//   const prompt = promptMap[step];
//   console.log("useCreateOrderMenu prompt", prompt);

//   useEffect(() => {
//     if (createOrderDisplay.source) {
//       console.log("useCreateOrderMenu setStarted useEffect called");
//       setStarted(true);
//     }
//   }, [createOrderDisplay.source]);

//   useEffect(() => {
//     if (started && !createOrderDisplay.source) {
//       console.log("useCreateOrderMenu close useEffect called");
//       close();
//       setStarted(false);
//     }
//   }, [close, started, createOrderDisplay.source]);

//   return {
//     options,
//     orderSummary: t(prompt, createOrderDisplay),
//     orderPrompt: t(summary, createOrderDisplay),
//     handleSelectOption: (option: string) => {
//       dispatch(uiActions.selectCreateOrderOption(option));
//     },
//   };
// };

// export default useCreateOrderMenu;
