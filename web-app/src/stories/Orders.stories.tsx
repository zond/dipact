import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { createMemoryHistory } from "history";

import Component from "../pages/Orders";
import { Router } from "react-router";
import { ordersDecorator, phaseSelectorDecorator } from "./decorators";

const WrappedComponent = () => {
  const history = createMemoryHistory();
  return (
    <Router history={history}>
      <Component />
    </Router>
  );
};

export default {
  title: "pages/Orders",
  component: WrappedComponent,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof WrappedComponent> = () => (
  <div style={{ width: "500px" }}>
    <WrappedComponent />
  </div>
);

type Args = React.ComponentProps<typeof Component>;

const defaultCombinedQuerystate = {
  isError: false,
  isLoading: false,
  isSuccess: true,
};

const defaultUseOrdersArgs = {
  combinedQueryState: defaultCombinedQuerystate,
  nationStatuses: [],
  noOrders: true,
  ordersConfirmed: false,
  userIsMember: true,
  toggleAcceptDraw: () => {},
  toggleConfirmOrders: () => {},
  phaseStateIsLoading: false,
};

const defaultUsePhaseSelectorArgs = {
  combinedQueryState: defaultCombinedQuerystate,
  phases: [],
  selectedPhase: undefined,
  setPhase: () => console.log("Set phase"),
  setNextPhase: () => console.log("Set next phase"),
  setPreviousPhase: () => console.log("Set previous phase"),
};

export const Default = Template.bind({});
Default.decorators = [
  ordersDecorator({ ...defaultUseOrdersArgs }),
  phaseSelectorDecorator({ ...defaultUsePhaseSelectorArgs }),
];
