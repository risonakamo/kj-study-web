import type {Meta,StoryObj} from "@storybook/react";

import {KjRow} from "@/components/kj-row/kj-row";

type Story=StoryObj<typeof KjRow>;

const meta:Meta<typeof KjRow>={
  title:"KJ row",
  component:KjRow,
  args:{
    sentence:"彼は茶碗を床にたたきつけた。",
    word:"茶碗"
  }
};
export default meta;

export const normal:Story={

};

export const selected:Story={
  args:{
    selected:true
  }
};

export const SelectedRed: Story = {
  args:{
    selected: true,
    sentenceState: "xed"
  }
};

export const SelectedGreen:Story={
  args:{
    selected:true,
    sentenceState:"checked"
  }
};