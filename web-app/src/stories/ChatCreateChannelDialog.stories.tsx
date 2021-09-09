import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Component from "../components/Chat/ChatCreateChannelDialog";
import { ChatCreateChannelDialogStub as Stub } from "../hooks/useChatCreateChannelDialog";

export default {
  title: "components/ChatCreateChannelDialog",
  component: Component,
} as ComponentMeta<typeof Component>;

type StubbedComponentProps = Parameters<typeof Component>[0] & { Context: React.Context<any>, stubbedValues: any }

const StubbedComponent = ({ Context, stubbedValues, ...args }: StubbedComponentProps) => {
  return (
      <Stub.Provider value={() => stubbedValues}>
        <Component {...args} />
      </Stub.Provider>
  )
}

const Template: ComponentStory<typeof StubbedComponent> = (args) => {
  return (
    <StubbedComponent {...args} />
  )
};

const defaultHookReturnValues = {
      isLoading: false,
      validationMessage: null,
      createChannel: (nations: string) => {},
}

const defaultArgs = {
    open: true,
    onClose: () => {},
    nations: ["England", "France", "Germany", "Russia"],
    userNation: "England",
    gameId: "1234",
    stubbedValues: {
      ...defaultHookReturnValues
    }
}


export const Open = Template.bind({});
Open.args = {
    ...defaultArgs,
}
export const Closed = Template.bind({});
Closed.args = {
    ...defaultArgs,
    open: false,
}
export const Loading = Template.bind({});
Loading.args = {
    ...defaultArgs,
    stubbedValues: {
      ...defaultHookReturnValues,
      isLoading: true,
    }
}
