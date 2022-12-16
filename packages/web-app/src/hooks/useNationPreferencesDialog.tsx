import { PageName, selectors } from "@diplicity/common";
import { useState, useEffect } from "react";
import { RootState } from "../store";
import { useAppSelector } from "./useAppSelector";
import { useLazyPageLoad } from "@diplicity/common";

const useNationPreferencesDialog = (variantName: string | null) => {
  const [preferences, setPreferences] = useState<string[]>([]);
  const triggerPageLoad = useLazyPageLoad(PageName.NationPreferencesDialog);

  const { nations } = useAppSelector((state: RootState) =>
    selectors.selectNationPreferencesDialogView(state, variantName || "")
  );

  useEffect(() => {
    if (variantName) {
      triggerPageLoad();
    }
  }, [variantName, triggerPageLoad]);

  useEffect(() => {
    if (!preferences.length && nations.length)
      setPreferences(nations as string[]);
  }, [nations, preferences.length]);

  const updateOrder = (direction: "up" | "down", idx: number) => {
    const nextIdx = direction === "down" ? idx + 1 : idx - 1;
    let tmpNations = preferences.slice();
    let tmp = preferences[nextIdx];
    tmpNations[nextIdx] = preferences[idx];
    tmpNations[idx] = tmp;
    setPreferences(tmpNations);
  };

  return {
    preferences,
    updateOrder,
  };
};

export default useNationPreferencesDialog;
