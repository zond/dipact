import { useTheme } from "../hooks/useTheme";
import React from "react";
import { ActivityIndicator } from "react-native";
import { translateKeys as tk } from "@diplicity/common";
import { useTranslation } from "react-i18next";

interface LoadingProps {
  size?: number | "large" | "small" | undefined;
}

const Loading = ({ size }: LoadingProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <ActivityIndicator
      accessibilityLabel={t(tk.loading.title)}
      animating={true}
      size={size}
      color={theme.palette.text.main}
    />
  );
};

export default Loading;
