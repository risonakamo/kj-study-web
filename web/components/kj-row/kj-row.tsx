import _ from "lodash";
import {CheckIcon, CopyIcon, Flag, Forward, XIcon} from "lucide-react";
import copy from "copy-to-clipboard";

import {splitSentenceOnWord} from "@/lib/sentence";
import {Button1} from "@/components/button1/button1";
import {searchForSentenceUrl, searchForWordUrl} from "@/lib/jisho-url";
import {Button2} from "@/components//button2/button2";

import "./kj-row.styl";

interface KjRowProps
{
  sentence:string
  word:string
}

/** main row element containing a sentence and all controls for interacting with the sentence */
export function KjRow(props:KjRowProps):JSX.Element
{
  /** clicked on link sentence button. open jisho tab searching for the sentence */
  function h_linkSentenceClick():void
  {
    window.open(searchForSentenceUrl(props.sentence),"_blank");
  }

  /** clicked link word button. open jisho tab searching for the word */
  function h_linkWordClick():void
  {
    window.open(searchForWordUrl(props.word),"_blank");
  }

  /** clicked copy all button. copy the sentence */
  function h_copySentenceClick():void
  {
    copy(props.sentence);
  }

  return <div className="kj-row">
    <div className="sentence-contain">
      <div className="word">
        <span className="bubble">
          {props.word}
        </span>
      </div>
      <div className="sentence">
        {generateSentencePieces(props.sentence,props.word)}
      </div>
    </div>

    <div className="state-control">
      <Button2 buttonStyle="left" icon={<CheckIcon className="check-icon"/>}/>
      <Button2 buttonStyle="right" icon={<XIcon className="x-icon"/>}/>
    </div>

    <div className="control">
      <div className="left">
        <Button1 icon={<Forward/>} text="Sentence" onClick={h_linkSentenceClick}/>
        <Button1 icon={<Forward/>} text="Word" onClick={h_linkWordClick}/>
        <Button1 icon={<CopyIcon/>} text="Copy All" onClick={h_copySentenceClick}/>
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