import {clsx} from "clsx";

import "./button2.styl";

type Button2Style="left"|"right"

interface Button2Props
{
  buttonStyle:Button2Style
  icon:JSX.Element

  onClick?():void
}

/** a wide rounded button with icon field only */
export function Button2(props:Button2Props):JSX.Element
{
  const topcx:string=clsx("button2",{
    "left-button":props.buttonStyle=="left",
    "right-button":props.buttonStyle=="right"
  });

  return <div className={topcx} onClick={props.onClick}>
    {props.icon}
  </div>;
}