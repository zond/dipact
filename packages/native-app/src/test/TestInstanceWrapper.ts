import { fireEvent } from "@testing-library/react-native";
import { ReactTestInstance } from "react-test-renderer";

interface ITestInstanceWrapper {
  toggle: () => void;
  type: (text: string) => void;
}

class TestInstanceWrapper implements ITestInstanceWrapper {
  constructor(private readonly _instance: ReactTestInstance) {}

  public get instance() {
    return this._instance;
  }

  public toggle() {
    fireEvent.press(this.instance);
  }

  public type(text: string) {
    fireEvent.changeText(this.instance, text);
  }
}

export class TestInstanceWrapperFactory {
  public static create(instance: ReactTestInstance) {
    return new TestInstanceWrapper(instance);
  }
}
