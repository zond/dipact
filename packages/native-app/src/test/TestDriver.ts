import { RenderAPI } from "@testing-library/react-native";
import { ReactTestInstance } from "react-test-renderer";
import { ITarget } from "./Target";
import { TestInstanceWrapperFactory } from "./TestInstanceWrapper";

export abstract class TestDriver {
  constructor(protected readonly screen: RenderAPI) {}
  private createInstanceWrapper(instance: ReactTestInstance) {
    return TestInstanceWrapperFactory.create(instance);
  }
  public get(target: ITarget) {
    return this.createInstanceWrapper(
      target.accessor.get(this.screen, target.match)
    );
  }
  public query(target: ITarget) {
    return target.accessor.query(this.screen, target.match);
  }
}
