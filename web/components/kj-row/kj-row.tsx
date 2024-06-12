import _ from "lodash";
import {Copy, Flag, Forward} from "lucide-react";

import {splitSentenceOnWord} from "@/lib/sentence";
import {Button1} from "@/components/button1/button1";

import "./kj-row.styl";

interface KjRowProps
{
  sentence:string
  word:string
}

/** main row element containing a sentence and all controls for interacting with the sentence */
export function KjRow(props:KjRowProps):JSX.Element
{
  return <div className="kj-row">
    <div className="sentence-contain">
      {generateSentencePieces(props.sentence,props.word)}
    </div>

    <div className="control">
      <div className="left">
        <Button1 icon={<Forward/>} text="Sentence"/>
        <Button1 icon={<Forward/>} text="Word"/>
        <Button1 icon={<Copy/>} text="Copy All"/>
      </div>
      <div className="right">
        <Button1 icon={<Flag/>} text="Sentence"/>
        <Button1 icon={<Flag/>} text="Word"/>
      </div>
    </div>
  </div>;
}

/** split sentence into spans on the target word. highlight the target word */
function generateSentencePieces(sentence:string,word:string):JSX.Element[]
{
  const sentencePieces:string[]=splitSentenceOnWord(sentence,word);

  return _.map(sentencePieces,(piece:string,i:number):JSX.Element=>{
    var pieceCx:string|undefined;

    if (piece==word)
    {
      pieceCx="highlighted";
    }

    return <span key={i} className={pieceCx}>{piece}</span>;
  })
}