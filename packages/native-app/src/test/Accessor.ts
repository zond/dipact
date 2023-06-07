import { RenderAPI } from "@testing-library/react-native";
import { ReactTestInstance } from "react-test-renderer";
import { IMatch } from "./Match";

export interface IAccessor {
  get(screen: RenderAPI, target: IMatch): ReactTestInstance;
  query(screen: RenderAPI, target: IMatch): ReactTestInstance | null;
  find(screen: RenderAPI, target: IMatch): Promise<ReactTestInstance>;
}

class ByText implements IAccessor {
  public get(screen: RenderAPI, target: IMatch) {
    return screen.getByText(target.textMatch, target.options);
  }
  public query(screen: RenderAPI, target: IMatch) {
    return screen.queryByText(target.textMatch, target.options);
  }
  public async find(screen: RenderAPI, target: IMatch) {
    return screen.findByText(target.textMatch, target.options);
  }
}

class ByAccessibilityLabel implements IAccessor {
  public get(screen: RenderAPI, target: IMatch) {
    return screen.getByA11yLabel(target.textMatch);
  }
  public query(screen: RenderAPI, target: IMatch): ReactTestInstance | null {
    return screen.queryByA11yLabel(target.textMatch);
  }
  public async find(
    screen: RenderAPI,
    target: IMatch
  ): Promise<ReactTestInstance> {
    return screen.findByA11yLabel(target.textMatch);
  }
}

export const Accessor = {
  ByText: new ByText(),
  ByAccessibilityLabel: new ByAccessibilityLabel(),
};
