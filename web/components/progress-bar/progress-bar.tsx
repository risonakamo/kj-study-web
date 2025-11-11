import "./progress-bar.styl";

interface ProgressBarProps
{

}

export function ProgressBar(props:ProgressBarProps):JSX.Element
{
  const numSegments:number=12;
  const width:number=100/numSegments;
  const widthStr:string=`${width}%`;

  const segments:JSX.Element[]=[];
  for (let i = 0; i < numSegments; i++)
  {
    segments.push(
      <div className="segment" key={i}
        style={{ width: widthStr }}
      >
        <div className="inner"></div>
      </div>
    );
  }

  return <div className="progress-bar">{segments}</div>;
}