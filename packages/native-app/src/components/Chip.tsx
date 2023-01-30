import React from "react";
import { Chip as RneChip, ChipProps as RneChipProps } from "@rneui/base";
import { useTheme } from "../hooks/useTheme";

interface ChipProps extends RneChipProps {
  variant: "success" | "error" | "warning" | "info";
}

const Chip = ({ variant, buttonStyle, titleStyle, ...rest }: ChipProps) => {
  const theme = useTheme();
  const variantColorMap = {
    success: theme.palette.success,
    error: theme.palette.error,
    warning: theme.palette.warning,
    info: theme.palette.info,
  } as const;
  const style = {
    button: {
      backgroundColor: variantColorMap[variant].main,
      paddingHorizontal: theme.spacing(0.25),
      paddingVertical: theme.spacing(0.2),
    },
    title: {
      color: variantColorMap[variant].contrastText,
    },
  };
  return (
    <RneChip
      buttonStyle={[style.button, buttonStyle]}
      titleStyle={[style.title, titleStyle]}
      {...rest}
    />
  );
};

export default Chip;
