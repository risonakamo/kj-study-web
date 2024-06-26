import {clsx} from "clsx";

import "./button1.styl";

interface Button1Props
{
  icon:JSX.Element
  text:string
  onClick?():void
  className?:string
}

export function Button1(props:Button1Props):JSX.Element
{
  const topcx:string=clsx(props.className,"button1");
  return <div className={topcx} onClick={props.onClick}>
    <span className="icon-wrap">
      {props.icon}
    </span>
    <span className="label">{props.text}</span>
  </div>;
}