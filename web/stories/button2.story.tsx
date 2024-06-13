import type {Meta,StoryObj} from "@storybook/react";
import {CheckIcon,XIcon} from "lucide-react";

import {Button2} from "@/components/button2/button2";

type Story=StoryObj<typeof Button2>;

const meta:Meta<typeof Button2>={
  title:"button 2",
  component:Button2,
  args:{
    buttonStyle:"left"
  }
};
export default meta;

export const normal:Story={
  render:()=>(<>
    <Button2 buttonStyle="left" icon={<CheckIcon/>}/>
    <Button2 buttonStyle="right" icon={<XIcon/>}/>
  </>)
};