import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Avatar } from ".";

import { expect } from "@storybook/jest";

export default {
  title: "Avatar",
  component: Avatar,
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;

export const Default = Template.bind({});

Default.args = {
  url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
};

Default.play = async ({ canvasElement, args }) => {
  const avatar = canvasElement.querySelector("img");

  expect(avatar).toBeInTheDocument();
  expect(avatar).toHaveAttribute("src", args.url);
  expect(avatar).toHaveStyle("border-radius: 9999px");
}

