import "./button1.styl";

interface Button1Props
{
  icon:JSX.Element
  text:string
}

export function Button1(props:Button1Props):JSX.Element
{
  return <div className="button1">
    <span className="icon-wrap">
      {props.icon}
    </span>
    <span className="label">{props.text}</span>
  </div>;
}