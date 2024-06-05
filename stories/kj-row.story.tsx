import type {Meta,StoryObj} from "@storybook/react";

import {KjRow} from "@/components/kj-row/kj-row";

type Story=StoryObj<typeof KjRow>;

const meta:Meta<typeof KjRow>={
  title:"KJ row",
  component:KjRow,
  args:{

  }
};
export default meta;

export const normal:Story={

};