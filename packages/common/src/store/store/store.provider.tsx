import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";

import { CreateStoreOptions, StoreProviderProps } from "./store.types";
import { createStore } from "./store";
import { DiplicityApiProvider } from "../diplicity";
import { FeedbackSliceProvider } from "../feedback";

async function createStoreAsync(
  options: CreateStoreOptions,
  callback: (result: Awaited<ReturnType<typeof createStore>>) => void
) {
  const { telemetryService } = options;
  telemetryService.logInfo("Creating store");
  const result = await createStore(options);
  telemetryService.logInfo("Store created");
  callback(result);
}

export const StoreProvider = ({
  children,
  createStoreOptions,
}: StoreProviderProps) => {
  const { telemetryService } = createStoreOptions;
  const [createStoreResult, setCreateStoreResult] = useState<null | Awaited<
    ReturnType<typeof createStore>
  >>(null);

  useEffect(() => {
    if (!createStoreResult) {
      createStoreAsync(createStoreOptions, (result) =>
        setCreateStoreResult(result)
      );
    }
  });

  if (!createStoreResult) {
    telemetryService.logInfo(
      "Rendering StoreProvider, waiting for store creation"
    );
    return null;
  }

  const [store, { diplicityApi, feedbackSlice }] = createStoreResult;

  return (
    <Provider store={store}>
      <DiplicityApiProvider diplicityApi={diplicityApi}>
        <FeedbackSliceProvider feedbackSlice={feedbackSlice}>
          {children}
        </FeedbackSliceProvider>
      </DiplicityApiProvider>
    </Provider>
  );
};
