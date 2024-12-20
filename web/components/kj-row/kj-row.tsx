import _ from "lodash";
import {CheckIcon, CopyIcon, Flag, Forward, XIcon} from "lucide-react";
import copy from "copy-to-clipboard";
import clsx from "clsx";
import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";

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

  showSearchButtons:boolean

  selected?:boolean

  onStatusChange(newStatus:KjRowStatus):void
  onClick?():void
  onHover():void

  // requesting to perform word search. might provide a sentence instead of a word
  onWordSearch(word:string):void
  // requesting to perform sentence search
  onSentenceSearch(sentence:string):void
}

export interface KjRowRef
{
  scrollTo():void
  doCopy():void
}

/** main row element containing a sentence and all controls for interacting with the sentence */
export const KjRow=forwardRef(KjRow_inner);
function KjRow_inner(props:KjRowProps,ref:React.Ref<KjRowRef>):JSX.Element
{
  // --- states
  const [justCopied,setJustCopied]=useState<boolean>(false);

  // --- refs
  const topElement=useRef<HTMLDivElement>(null);

  const justCopiedTimeout=useRef<number|null>(null);



  // --- component ref setup
  useImperativeHandle(ref,():KjRowRef=>{
    return {
      scrollTo:scrollToMe,
      doCopy
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

  /** copy this row's sentence and trigger appearance changes on the copy button */
  function doCopy():void
  {
    copy(props.sentence);

    setJustCopied(true);

    if (justCopiedTimeout.current!=null)
    {
      clearTimeout(justCopiedTimeout.current);
    }

    justCopiedTimeout.current=setTimeout(()=>{
      setJustCopied(false);
    },2000);
  }




  // --- handlers
  /** clicked on link sentence button. open jisho tab searching for the sentence */
  function h_linkSentenceClick():void
  {
    props.onSentenceSearch(props.sentence);
  }

  /** clicked link word button. open jisho tab searching for the word */
  function h_linkWordClick():void
  {
    props.onWordSearch(props.word);
  }

  /** clicked link all button. open jisho tab searching for sentence in pieces mode */
  function h_linkAllClick():void
  {
    props.onWordSearch(props.sentence);
  }

  /** clicked copy all button. copy the sentence. set the copied state to true, and set timer
   *  to reset the copied state */
  function h_copySentenceClick():void
  {
    doCopy();
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


  // --- render func
  /** conditionally render the search buttons */
  function r_searchButtons():JSX.Element
  {
    if (!props.showSearchButtons)
    {
      return <></>;
    }

    return <>
      <Button1 icon={<Forward/>} text="All" onClick={h_linkAllClick}/>
      <Button1 icon={<Forward/>} text="Word" onClick={h_linkWordClick}/>
      <Button1 icon={<Forward/>} text="Sentence" onClick={h_linkSentenceClick}/>
    </>;
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

  var copyButtonText:string="Copy";
  var copyButtonIcon:JSX.Element=<CopyIcon/>;
  var copyButtonClass:string="";

  if (justCopied)
  {
    copyButtonText="Copied";
    copyButtonIcon=<CheckIcon/>;
    copyButtonClass="copied";
  }



  // --- render
  return <div className={topCx} onClick={props.onClick} ref={topElement}
    onMouseEnter={props.onHover}
  >
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
        {r_searchButtons()}
        <Button1 icon={copyButtonIcon} text={copyButtonText} onClick={h_copySentenceClick}
          className={copyButtonClass}/>
      </div>
      <div className="right">
        {/* <Button1 icon={<Flag/>} text="Sentence"/>
        <Button1 icon={<Flag/>} text="Word"/> */}
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