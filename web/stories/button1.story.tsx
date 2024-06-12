import type {Meta,StoryObj} from "@storybook/react";
import {Forward,Flag} from "lucide-react";

import {Button1} from "@/components/button1/button1";

type Story=StoryObj<typeof Button1>;

const meta:Meta<typeof Button1>={
  title:"button 1",
  component:Button1,
  args:{
    icon:<Forward/>,
    text:"Sentence"
  }
};
export default meta;

export const normal:Story={

};

export const normal2:Story={
  args:{
    icon:<Flag/>,
    text:"Word"
  }
};