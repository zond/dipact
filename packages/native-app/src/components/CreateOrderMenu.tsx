import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useCreateOrderMenu } from "diplicity-common-internal";
import { Picker } from "@react-native-picker/picker";

interface CreateOrderMenuProps {
  close: Parameters<typeof useCreateOrderMenu>[0];
}

const useStyles = () => {
  return StyleSheet.create({
    pickerPlaceholderOption: {
      display: "none",
    },
  });
};

const CreateOrderMenu = ({ close }: CreateOrderMenuProps) => {
  const styles = useStyles();
  const { options, orderSummary, orderPrompt, handleSelectOption } =
    useCreateOrderMenu(close);

  const handleValueChange = (value: string) => {
    if (!value) {
      return;
    }
    handleSelectOption(value);
  };

  return (
    <View>
      <Text>{orderSummary}</Text>
      <Text>{orderPrompt}</Text>
      <Picker
        onValueChange={handleValueChange}
        testID={"CREATE_ORDER_MENU_PICKER"}
      >
        <Picker.Item
          key={""}
          // TODO translate
          label={"-- Select an option --"}
          value={null}
          enabled={true}
          style={styles.pickerPlaceholderOption}
        />
        {options?.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </Picker>
    </View>
  );
};

export default CreateOrderMenu;
