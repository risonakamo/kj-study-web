import {clsx} from "clsx";

import "./button2.styl";

/** appearance styles */
type Button2Style="left"|"right"

/** active state style */
export type Button2State="normal"|"active-green"|"active-red"|"sub-active"

interface Button2Props
{
  buttonStyle:Button2Style
  icon:JSX.Element
  state:Button2State

  onClick?():void
}

/** a wide rounded button with icon field only */
export function Button2(props:Button2Props):JSX.Element
{
  const topcx:string=clsx("button2",{
    "left-button":props.buttonStyle=="left",
    "right-button":props.buttonStyle=="right",

    "active-green":props.state=="active-green",
    "active-red":props.state=="active-red",
    "sub-active":props.state=="sub-active"
  });

  return <div className={topcx} onClick={props.onClick}>
    {props.icon}
  </div>;
}