import React from "react";

import {
  OrderDisplay,
  ResolutionDisplay,
  translateKeys as tk,
} from "@diplicity/common";
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
      display: "flex",
      justifyContent: "flex-end",
      color:
        resolution?.message === tk.orders.resolution.success
          ? theme.palette.success.main
          : theme.palette.error.main,
    },
  });
};

interface OrderProps {
  order: OrderDisplay;
}

const Order = ({ order }: OrderProps) => {
  const { t } = useTranslation();
  const { label, resolution, inconsistencies } = order;
  const styles = useStyles({ resolution });

  return (
    <View style={styles.root}>
      <Text>{label}</Text>
      {resolution && (
        <Text style={styles.orderResolution}>
          {t(resolution.message, { province: resolution.province })}
        </Text>
      )}
    </View>
    //   <ul className={classes.orderInconsistencies}>
    //     {inconsistencies.map((inconsistency) => (
    //       <li key={inconsistency}>
    //         <Typography variant="body2">{inconsistency}</Typography>
    //       </li>
    //     ))}
    //   </ul>
  );
};

export default Order;
