import React from "react";
import { ScrollView } from "react-native";
import BottomSheet from "./BottomSheet";

interface BottomSheetSelectProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  onPress: (value: any) => void;
}

const BottomSheetSelect = ({
  isOpen,
  setIsOpen,
  children,
  onPress,
}: BottomSheetSelectProps) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onPress: () => {
          const value = (child.props as { value: any }).value;
          if (value) {
            onPress(value);
          }
          setIsOpen(false);
        },
      } as React.Attributes);
    }
    return child;
  });

  return (
    <BottomSheet
      isVisible={isOpen}
      onBackdropPress={() => setIsOpen(false)}
      // eslint-disable-next-line react-native/no-inline-styles
      cardStyle={{ maxHeight: 300 }}
    >
      <ScrollView>{childrenWithProps}</ScrollView>
    </BottomSheet>
  );
};

export default BottomSheetSelect;
