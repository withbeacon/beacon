import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Loading } from ".";

import { expect } from "@storybook/jest";

export default {
  title: 'Loading',
  component: Loading,
} as ComponentMeta<typeof Loading>;

const Template: ComponentStory<typeof Loading> = () => <Loading />;

export const Default = Template.bind({});

Default.play = async ({ canvasElement }) => {
  const loading = canvasElement.querySelector("div");
  expect(loading).toBeInTheDocument();
}

