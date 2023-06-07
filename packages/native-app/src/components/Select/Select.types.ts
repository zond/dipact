export type MenuItemValue = string | number;

export interface MenuItemProps {
  value: MenuItemValue;
  label: string;
  onPress?: (value: MenuItemValue) => void;
}
