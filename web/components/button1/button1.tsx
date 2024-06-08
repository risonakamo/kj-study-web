import {Forward} from "lucide-react";

import "./button1.styl";

interface Button1Props
{

}

export function Button1(props:Button1Props):JSX.Element
{
  return <div className="button1">
    <Forward/>
    Sentence
  </div>;
}