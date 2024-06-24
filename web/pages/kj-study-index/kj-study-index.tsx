import {createRoot} from "react-dom/client";
import {QueryClient,QueryClientProvider, useMutation, useQuery} from "@tanstack/react-query";
import _ from "lodash";
import {useEffect, useMemo, useRef} from "react";
import {useImmer}  from "use-immer";
import {ArrowRight, RefreshCcw} from "lucide-react";

import {KjRow, KjRowStatus} from "@/components/kj-row/kj-row";
import {apiSetSentenceState, apiShuffleSentences, getKjSession} from "@/apis/kj-study";
import {updateSentenceListStatus} from "@/lib/word-sentence";
import {Button1} from "@/components/button1/button1";

import "./kj-study-index.styl";

const QyClient:QueryClient=new QueryClient();

function KjStudyIndex():JSX.Element
{
  // --- states
  /** the current session */
  const [session,setSession]=useImmer<KjStudySession>({
    wordSentences:[]
  });

  /** if did initial shuffle after first data load */
  const didShuffle=useRef<boolean>(false);



  // --- qys
  /** initial api call to get session. sets the session state after completion. shuffles the
   *  words in the retrieved session, but only the first time this is called */
  const getSessionMqy=useMutation<KjStudySession>({
    mutationFn():Promise<KjStudySession>
    {
      return getKjSession();
    },

    onSuccess(data:KjStudySession):void
    {
      if (!didShuffle.current)
      {
        setSessionAndShuffle(data);
        didShuffle.current=true;
      }

      setSession(data);
    }
  });

  /** call to update backend data. does nothing with frontend data */
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

  /** call to shuffle sentences. set the state on getting new sentences */
  const shuffleSessionMqy=useMutation<KjStudySession>({
    mutationFn():Promise<KjStudySession>
    {
      return apiShuffleSentences();
    },

    // set the word sentences to the result
    onSuccess(data:KjStudySession):void
    {
      setSessionAndShuffle(data);
    }
  });



  // --- effects
  /** call initial session get */
  useEffect(()=>{
    getSessionMqy.mutateAsync();
  },[]);


  // --- state setters
  /** set a session, but shuffle before doing so */
  function setSessionAndShuffle(newSession:KjStudySession):void
  {
    newSession.wordSentences=_.shuffle(newSession.wordSentences);
    setSession(newSession);
  }



  // --- handlers
  /** clicked shuffle session button. trigger shuffle session request */
  function h_shuffleSessionButton():void
  {
    shuffleSessionMqy.mutateAsync();
  }


  // --- render funcs
  /** render the kj rows from the kj data list */
  function r_kjRows():JSX.Element[]
  {
    return _.map(session.wordSentences,(data:WordSentencePair):JSX.Element=>{
      /** row's status changed. update the web-side state and send mqy to update the backend state */
      function h_statusChange(newStatus:KjRowStatus):void
      {
        const newStatus2:WordSentenceStatus=kjRowStatusToSentenceStatus(newStatus);

        setSession((draft)=>{
          updateSentenceListStatus(
            draft.wordSentences,

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

      return <KjRow
        key={data.word+data.sentence}
        word={data.word}
        sentence={data.sentence}
        sentenceState={sentenceStatusToKjRowStatus(data.status)}
        onStatusChange={h_statusChange}
      />;
    });
  }



  // --- render
  return <>
    <div className="contain">
      <div className="top">
        <div className="left">
          <Button1 icon={<RefreshCcw/>} text="Shuffle Session" onClick={h_shuffleSessionButton}/>
        </div>
        <div className="right">
          <select className="data-selector">
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </select>
          <Button1 icon={<ArrowRight/>} text="Load Data"/>
        </div>
      </div>

      <div className="kj-rows">
        {r_kjRows()}
      </div>
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