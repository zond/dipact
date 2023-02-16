import React, { createContext, useState, useContext } from "react";
import { BottomSheet as RNEBottomSheet, Divider } from "@rneui/base";
import { StyleSheet, View } from "react-native";
import Button, { ButtonProps } from "./Button";
import { useTheme } from "../hooks/useTheme";

export const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    root: {
      backgroundColor: theme.palette.paper.main,
    },
    button: {
      justifyContent: "flex-start",
      paddingVertical: theme.spacing(2),
    },
    buttonContainer: {
      flexGrow: 1,
    },
    selectButtonContainer: {
      width: "100%",
    },
    selectButton: {
      display: "flex",
      flexDirection: "row-reverse",
      width: "100%",
      justifyContent: "space-between",
      padding: theme.spacing(2),
    },
  });
};

interface BottomSheetWrapperProps {
  children: React.ReactNode;
}

type SelectOptionProps = ButtonProps & {
  selected: boolean;
  onChange: (value: string) => void;
  value: string;
};

type BottomSheetElementType = "button" | "selectOption";

type BottomSheetButton = SelectOptionProps & {
  elementType: "button";
};

type BottomSheetSelectOption = SelectOptionProps & {
  elementType: "selectOption";
};

export type BottomSheetElement = BottomSheetButton | BottomSheetSelectOption;

type BottomSheetSection = {
  elements: BottomSheetElement[];
  title?: string;
};

type BottomSheetProps = { sections: BottomSheetSection[] };

// Test if argument has type BottomSheetSelectOption
const isSelectOption = (
  element: BottomSheetElement
): element is BottomSheetSelectOption => {
  return element.elementType === "selectOption";
};

const isButton = (
  element: BottomSheetElement
): element is BottomSheetButton => {
  return element.elementType === "button";
};

const BottomSheetButton = (props: ButtonProps) => {
  const styles = useStyles();
  const [_, withCloseBottomSheet] = useBottomSheet();
  return (
    <Button
      title={props.title}
      upperCase={false}
      {...props}
      onPress={props.onPress ? withCloseBottomSheet(props.onPress) : undefined}
      buttonStyle={[styles.button, props.buttonStyle]}
      containerStyle={[styles.buttonContainer, props.containerStyle]}
    />
  );
};

const BottomSheetSelectOption = (props: SelectOptionProps) => {
  const styles = useStyles();
  const [_, withCloseBottomSheet] = useBottomSheet();
  return (
    <Button
      title={props.title}
      upperCase={false}
      iconProps={{
        type: "material-community",
        name: props.selected ? "radiobox-marked" : "radiobox-blank",
        size: 20,
      }}
      {...props}
      onPress={withCloseBottomSheet(() => props.onChange(props.value))}
      containerStyle={[styles.selectButtonContainer, props.containerStyle]}
      buttonStyle={[styles.selectButton, props.buttonStyle]}
    />
  );
};

const BottomSheet = ({ sections }: BottomSheetProps) => {
  const styles = useStyles();
  return (
    <View style={styles.root}>
      {sections.map(({ elements }, index) => (
        <View key={index}>
          {elements.map((props, index) => (
            <View key={index}>
              {isButton(props) ? (
                <BottomSheetButton {...props} />
              ) : (
                isSelectOption(props) && <BottomSheetSelectOption {...props} />
              )}
            </View>
          ))}
          <Divider />
        </View>
      ))}
    </View>
  );
};

export const toBottomSheetElement = (
  elementType: BottomSheetElementType,
  props: ButtonProps
): BottomSheetElement => {
  return {
    ...props,
    elementType,
  } as BottomSheetElement;
};

export type BottomSheetContent = BottomSheetProps;

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
  const [content, setContent] = useState<null | BottomSheetContent>(null);
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
      <RNEBottomSheet
        modalProps={{}}
        isVisible={isVisible}
        onBackdropPress={() => setContent(null)}
      >
        {content && <BottomSheet {...content} />}
      </RNEBottomSheet>
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetWrapper;
