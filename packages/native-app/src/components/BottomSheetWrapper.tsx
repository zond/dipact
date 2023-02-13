import React, { createContext, useState, useContext } from "react";
import { BottomSheet } from "@rneui/base";

interface BottomSheetWrapperProps {
  children: React.ReactNode;
}

type BottomSheetContent = () => JSX.Element;

const BottomSheetContext = createContext<
  [
    (value: BottomSheetContent | null) => void,
    (callback: (...args: any[]) => void) => () => void
  ]
>([
  (_: BottomSheetContent | null) => {},
  (_: (...args: any[]) => void) => () => {},
]);

export const useBottomSheet = () => {
  return useContext(BottomSheetContext);
};

const BottomSheetWrapper = ({
  children,
}: BottomSheetWrapperProps): React.ReactElement => {
  const [content, setContent] = useState<null | (() => JSX.Element)>(null);
  const isVisible = Boolean(content);

  const withCloseBottomSheet = (callback: (...args: any[]) => void) => {
    return (...args: any[]) => {
      callback(...args);
      setContent(null);
    };
  };

  return (
    <BottomSheetContext.Provider value={[setContent, withCloseBottomSheet]}>
      {children}
      <BottomSheet
        modalProps={{}}
        isVisible={isVisible}
        onBackdropPress={() => setContent(null)}
      >
        {content}
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetWrapper;
