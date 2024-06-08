import type {Meta,StoryObj} from "@storybook/react";

import {Button1} from "@/components/button1/button1";

type Story=StoryObj<typeof Button1>;

const meta:Meta<typeof Button1>={
  title:"button 1",
  component:Button1,
  args:{

  }
};
export default meta;

export const normal:Story={

};