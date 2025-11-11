import _ from "lodash";
import clsx from "clsx";

import "./progress-bar.styl";

interface ProgressBarProps
{
  session:KjStudySession
  selectedRow:number|null
}

export function ProgressBar(props:ProgressBarProps):JSX.Element
{
  const numSegments:number=props.session.wordSentences.length;
  const segmentWidth:number=100/numSegments;
  const widthStr:string=`${segmentWidth}%`;

  const segments:JSX.Element[]=_.map(props.session.wordSentences,
    (wordSent:WordSentencePair,i:number):JSX.Element=>{
      const innerCx:string=clsx("inner",{
        "good":wordSent.status=="active-green",
        "bad":wordSent.status=="active-red",
        "active":i==props.selectedRow,
      });

      return <div className="segment" key={i}
        style={{ width: widthStr }}
      >
        <div className={innerCx}></div>
      </div>;
    },
  );

  return <div className="progress-bar">{segments}</div>;
}