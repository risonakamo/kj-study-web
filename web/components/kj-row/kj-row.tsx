import _ from "lodash";
import {ForwardIcon} from "lucide-react";

import {splitSentenceOnWord} from "@/lib/sentence-lib";

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
        <span>
          <ForwardIcon/>
          <span>Sentence</span>
        </span>
        <button>link sentence</button>
        <button>link word</button>
        <button>copy full sentence</button>
      </div>
      <div className="right">
        <button>flag sentence</button>
        <button>flag word</button>
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