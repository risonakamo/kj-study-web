import {createRoot} from "react-dom/client";
import {QueryClient,QueryClientProvider, useMutation, useQuery} from "@tanstack/react-query";
import _ from "lodash";
import {useEffect, useMemo, useRef} from "react";
import {useImmer}  from "use-immer";

import {KjRow, KjRowStatus} from "@/components/kj-row/kj-row";
import {apiSetSentenceState, getKjSession} from "@/apis/kj-study";
import {updateSentenceListStatus} from "@/lib/word-sentence";
import {Button1} from "@/components/button1/button1";
import {RefreshCcw} from "lucide-react";

import "./kj-study-index.styl";

const QyClient:QueryClient=new QueryClient();

function KjStudyIndex():JSX.Element
{
  /** the current sentences list */
  const [sentences,setSentences]=useImmer<WordSentencePair[]>([]);

  /** if did initial shuffle after first data load */
  const didShuffle=useRef<boolean>(false);



  // --- qys
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

  /** call to update backend data */
  const updateSentenceStateMqy=useMutation({
    mutationFn(wordSentenceUpdate:WordSentencePair):Promise<void>
    {
      return apiSetSentenceState(
        wordSentenceUpdate.word,
        wordSentenceUpdate.sentence,
        wordSentenceUpdate.status,
      );
    }
  });



  // --- effects
  // on session data changing from qy, update the mirrored sentences state with shuffling, but only
  // shuffle once.
  useEffect(()=>{
    var sentences:WordSentencePair[]=kjSessionQy.data.wordSentences;

    if (sentences.length && !didShuffle.current)
    {
      sentences=_.shuffle(sentences);
      didShuffle.current=true;
    }

    setSentences(sentences);
  },[kjSessionQy.data]);


  // --- derived
  /** dervied word sentence list that is shuffled */
  // const shuffledSentences:WordSentencePair[]=useMemo(()=>{
  //   return _.shuffle(kjSessionQy.data.wordSentences);
  // },[kjSessionQy.data]);

  /** render the kj rows from the kj data list */
  function r_kjRows():JSX.Element[]
  {
    return _.map(sentences,(data:WordSentencePair):JSX.Element=>{
      /** row's status changed. update the web-side state and send mqy to update the backend state */
      function h_statusChange(newStatus:KjRowStatus):void
      {
        const newStatus2:WordSentenceStatus=kjRowStatusToSentenceStatus(newStatus);

        setSentences((draft)=>{
          updateSentenceListStatus(
            draft,

            data.word,
            data.sentence,
            newStatus2,
          )
        });

        updateSentenceStateMqy.mutateAsync({
          word:data.word,
          sentence:data.sentence,
          status:newStatus2
        });
      }

      return <KjRow key={data.word} word={data.word} sentence={data.sentence}
        sentenceState={sentenceStatusToKjRowStatus(data.status)} onStatusChange={h_statusChange}/>;
    });
  }

  return <>
    <div className="top">
      <Button1 icon={<RefreshCcw/>} text="Shuffle Session"/>
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

/** convert kj row status into sentence status */
function kjRowStatusToSentenceStatus(rowStatus:KjRowStatus):WordSentenceStatus
{
  switch (rowStatus)
  {
    case "checked":
    return "active-green";

    case "xed":
    return "active-red";
  }

  return "normal";
}

function main()
{
  createRoot(document.querySelector("main")!).render(
    <QueryClientProvider client={QyClient}>
      <KjStudyIndex/>
    </QueryClientProvider>
  );
}

window.onload=main;