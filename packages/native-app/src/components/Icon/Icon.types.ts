export interface IconProps {
  icon: string;
  size?: "small" | "medium" | "large";
}

export type IconStyleProps = Pick<IconProps, "size">;
