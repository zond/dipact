import React from "react";
import { StyleSheet } from "react-native";

import { useTheme } from "../hooks/useTheme";
import { useBottomSheet } from "./BottomSheetWrapper";
import Button from "./Button";
import { Stack } from "./Stack";

interface BaseProps {
  nullable: boolean;
  placeholder: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

type SelectProps = BaseProps & {
  variant: "select";
  options: { value: string; label: string }[];
};

type FilterProps = SelectProps;

type StyleProps = {
  active?: boolean;
};

const useStyles = ({ active }: StyleProps) => {
  const theme = useTheme();
  return StyleSheet.create({
    button: {
      backgroundColor: active
        ? theme.palette.secondary.main
        : theme.palette.paper.main,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: active
        ? theme.palette.border.main
        : theme.palette.border.light,
      paddingHorizontal: theme.spacing(2),
      paddingVertical: theme.spacing(0.5),
    },
  });
};

const SelectMenu = ({
  options,
  onChange,
  nullable,
}: Pick<SelectProps, "onChange" | "nullable"> & {
  options: { value: string; label: string; selected: boolean }[];
}) => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    root: {
      backgroundColor: theme.palette.paper.main,
    },
    removeButtonContainer: {
      borderBottomWidth: 1,
      borderBottomColor: theme.palette.border.light,
    },
    removeButtonTitle: {
      fontWeight: "bold",
    },
    buttonContainer: {
      width: "100%",
    },
    button: {
      display: "flex",
      flexDirection: "row-reverse",
      width: "100%",
      justifyContent: "space-between",
      padding: theme.spacing(2),
    },
  });
  return (
    <Stack orientation="vertical" style={styles.root}>
      {Boolean(nullable) && (
        <Button
          title={"Remove filter"}
          upperCase={false}
          onPress={() => onChange(undefined)}
          iconProps={{
            type: "material-community",
            name: "close-circle",
            size: 20,
          }}
          iconRight
          containerStyle={[
            styles.buttonContainer,
            styles.removeButtonContainer,
          ]}
          buttonStyle={styles.button}
          titleStyle={styles.removeButtonTitle}
        />
      )}
      {options.map(({ value, label, selected }) => {
        const iconName = selected ? "radiobox-marked" : "radiobox-blank";
        console.log(value);
        return (
          <Button
            title={label}
            key={value}
            upperCase={false}
            onPress={() => onChange(value)}
            iconProps={{ type: "material-community", name: iconName, size: 20 }}
            iconRight
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
          />
        );
      })}
    </Stack>
  );
};

const withSelected = (
  options: SelectProps["options"],
  value: string | undefined
) => {
  return options.map((option) => ({
    ...option,
    selected: option.value === value,
  }));
};

export const Filter = ({
  onChange,
  options,
  value,
  placeholder,
  nullable,
}: FilterProps) => {
  const active = Boolean(value);
  const styles = useStyles({ active });
  const selectedOption = options.find((option) => option.value === value);
  const title = selectedOption ? selectedOption.label : placeholder;

  const [setBottomSheet, withCloseBottomSheet] = useBottomSheet();

  const onPressFilter = () => {
    setBottomSheet(() => (
      <SelectMenu
        options={withSelected(options, value)}
        onChange={withCloseBottomSheet(onChange)}
        nullable={nullable}
      />
    ));
  };

  return (
    <Button
      title={title}
      buttonStyle={styles.button}
      iconProps={{ type: "material-community", name: "menu-down" }}
      iconRight
      upperCase={false}
      onPress={onPressFilter}
    />
  );
};
