import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { createMemoryHistory } from "history";

import Component from "../pages/Orders";
import useOrders, { useDIContext } from "../hooks/useOrders";
import { Router } from "react-router";

type WrappedComponentProps = ReturnType<typeof useOrders>;

const WrappedComponent = (props: WrappedComponentProps) => {
  const history = createMemoryHistory();
  return (
    <Router history={history}>
      <useDIContext.Provider value={() => props}>
        <Component />
      </useDIContext.Provider>
    </Router>
  );
};

export default {
  title: "pages/Orders",
  component: WrappedComponent,
  args: {
    isError: false,
    isLoading: false,
    error: null,
    nationStatuses: [],
    ordersConfirmed: false,
    userIsMember: true,
    toggleAcceptDraw: () => {},
    toggleConfirmOrders: () => {},
    phasesDisplay: [],
    setSelectedPhase: () => {},
    phaseStateIsLoading: false,
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof WrappedComponent> = (args) => (
  <div style={{ width: "500px" }}>
    <WrappedComponent {...args} />
  </div>
);

type Args = React.ComponentProps<typeof Component>;

export const Default = Template.bind({});
// Default.args = {
//   ...defaultArgs,
// };
