import {createRoot} from "react-dom/client";
import {QueryClient,QueryClientProvider, useQuery} from "@tanstack/react-query";
import _ from "lodash";
import {useMemo} from "react";

import {KjRow, KjRowStatus} from "@/components/kj-row/kj-row";
import {getKjSession} from "@/apis/kj-study";

import "./kj-study-index.styl";

function KjStudyIndex():JSX.Element
{
  /** the session */
  const kjSessionQy=useQuery<KjStudySession>({
    queryKey:["kj-session"],

    initialData:{
      wordSentences:[]
    },

    refetchOnWindowFocus:false,
    refetchOnReconnect:false,

    async queryFn():Promise<KjStudySession>
    {
      return getKjSession();
    }
  });

  /** dervied word sentence list that is shuffled */
  const shuffledSentences:WordSentencePair[]=useMemo(()=>{
    return _.shuffle(kjSessionQy.data.wordSentences);
  },[kjSessionQy.data]);

  /** render the kj rows from the kj data list */
  function r_kjRows():JSX.Element[]
  {
    function h_statusChange(newStatus:KjRowStatus):void
    {

    }

    return _.map(shuffledSentences,(data:WordSentencePair):JSX.Element=>{
      return <KjRow key={data.word} word={data.word} sentence={data.sentence}
        sentenceState={sentenceStatusToKjRowStatus(data.status)} onStatusChange={h_statusChange}/>;
    });
  }

  return <>
    <div className="top">

    </div>

    <div className="kj-rows">
      {r_kjRows()}
    </div>
  </>;
}

/** convert sentence status to kj row status. these should probably be unifed at some point */
function sentenceStatusToKjRowStatus(sentenceStatus:WordSentenceStatus):KjRowStatus
{
  switch (sentenceStatus)
  {
    case "active-green":
    return "checked";

    case "active-red":
    return "xed";
  }

  return "normal";
}

function main()
{
  createRoot(document.querySelector("main")!).render(
    <QueryClientProvider client={new QueryClient()}>
      <KjStudyIndex/>
    </QueryClientProvider>
  );
}

window.onload=main;