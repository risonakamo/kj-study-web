import _ from "lodash";
import {CheckIcon, CopyIcon, Flag, Forward, XIcon} from "lucide-react";
import copy from "copy-to-clipboard";
import clsx from "clsx";
import React, {forwardRef, useImperativeHandle, useRef} from "react";

import {splitSentenceOnWord} from "@/lib/sentence";
import {Button1} from "@/components/button1/button1";
import {searchForSentenceNewTab, searchForWordNewTab} from "@/lib/jisho-url";
import {Button2, Button2State} from "@/components//button2/button2";

import "./kj-row.styl";

/** visual appearance states of kj row */
export type KjRowStatus="normal"|"checked"|"xed"

interface KjRowProps
{
  sentence:string
  word:string
  sentenceState:KjRowStatus

  selected?:boolean

  onStatusChange(newStatus:KjRowStatus):void
  onClick():void
}

export interface KjRowRef
{
  scrollTo():void
}

/** main row element containing a sentence and all controls for interacting with the sentence */
export const KjRow=forwardRef(KjRow_inner);
function KjRow_inner(props:KjRowProps,ref:React.Ref<KjRowRef>):JSX.Element
{
  // --- refs
  const topElement=useRef<HTMLDivElement>(null);



  // --- component ref setup
  useImperativeHandle(ref,():KjRowRef=>{
    return {
      scrollTo:scrollToMe
    };
  });



  // --- funcs
  /** scroll to this element */
  function scrollToMe():void
  {
    topElement.current?.scrollIntoView({
      block:"center"
    });
  }




  // --- handlers
  /** clicked on link sentence button. open jisho tab searching for the sentence */
  function h_linkSentenceClick():void
  {
    searchForSentenceNewTab(props.sentence);
  }

  /** clicked link word button. open jisho tab searching for the word */
  function h_linkWordClick():void
  {
    searchForWordNewTab(props.word);
  }

  /** clicked copy all button. copy the sentence */
  function h_copySentenceClick():void
  {
    copy(props.sentence);
  }

  /** clicked check button. if already checked, set state to unchecked. otherwise, set to checked. */
  function h_clickedCheck():void
  {
    if (props.sentenceState=="checked")
    {
      props.onStatusChange("normal");
    }

    else
    {
      props.onStatusChange("checked");
    }
  }

  /** clicked X button. if already xed, set to normal. otherwise, set to Xed */
  function h_clickedXed():void
  {
    if (props.sentenceState=="xed")
    {
      props.onStatusChange("normal");
    }

    else
    {
      props.onStatusChange("xed");
    }
  }



  // --- render vars
  const topCx:string=clsx("kj-row",{
    checked:props.sentenceState=="checked",
    xed:props.sentenceState=="xed",
    selected:props.selected
  });

  var checkButtonStatus:Button2State="normal";
  var exButtonStatus:Button2State="normal";

  if (props.sentenceState=="checked")
  {
    checkButtonStatus="active-green";
    exButtonStatus="sub-active";
  }

  else if (props.sentenceState=="xed")
  {
    exButtonStatus="active-red";
    checkButtonStatus="sub-active";
  }



  // --- render
  return <div className={topCx} onClick={props.onClick} ref={topElement}>
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
      <Button2 buttonStyle="left" icon={<CheckIcon className="check-icon"/>} onClick={h_clickedCheck}
        state={checkButtonStatus}/>
      <Button2 buttonStyle="right" icon={<XIcon className="x-icon"/>} onClick={h_clickedXed}
        state={exButtonStatus}/>
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