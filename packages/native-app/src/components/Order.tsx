import React from "react";

import {
  OrderDisplay,
  ResolutionDisplay,
  translateKeys as tk,
} from "diplicity-common-internal";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";

interface StyleProps {
  resolution: ResolutionDisplay | null;
}

const useStyles = ({ resolution }: StyleProps) => {
  const theme = useTheme();
  return StyleSheet.create({
    root: {
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    orderResolution: {
      justifyContent: "flex-end",
      textAlign: "right",
      color:
        resolution?.message === tk.orders.resolution.success
          ? theme.palette.success.main
          : theme.palette.error.main,
    },
    column: {
      flex: 1,
      flexWrap: "wrap",
    },
  });
};

interface OrderProps {
  order: OrderDisplay;
}

const Order = ({ order }: OrderProps) => {
  const { t } = useTranslation();
  const { label, resolution } = order;
  const styles = useStyles({ resolution });

  return (
    <View style={styles.root}>
      <Text style={styles.column}>{label}</Text>
      {resolution && (
        <Text style={[styles.orderResolution, styles.column]}>
          {t(resolution.message, { province: resolution.province })}
        </Text>
      )}
    </View>
  );
};

export default Order;
