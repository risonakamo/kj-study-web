import {createRoot} from "react-dom/client";
import {QueryClient,QueryClientProvider, useMutation, useQuery} from "@tanstack/react-query";
import _ from "lodash";
import {useEffect, useMemo, useRef, useState} from "react";
import {useImmer}  from "use-immer";
import {ArrowRight, RefreshCcw} from "lucide-react";
import NatCompare from "natural-compare";

import {KjRow, KjRowStatus} from "@/components/kj-row/kj-row";
import {apiSetSentenceState, apiShuffleSentences, getKjFiles, getKjSession,
  startNewSession} from "@/apis/kj-study";
import {updateSentenceListStatus} from "@/lib/word-sentence";
import {Button1} from "@/components/button1/button1";

import "./kj-study-index.styl";

const QyClient:QueryClient=new QueryClient();

function KjStudyIndex():JSX.Element
{
  // --- states
  /** the current session */
  const [session,setSession]=useImmer<KjStudySession>({
    wordSentences:[],
    datafile:""
  });

  /** if did initial shuffle after first data load */
  const didShuffle=useRef<boolean>(false);

  const [selectedDatafile,setSelectedDatafile]=useState<string>("");



  // --- qys
  /** the list of data files */
  const datafilesListQy=useQuery<string[]>({
    queryKey:["datafiles-list"],
    initialData:[],

    refetchOnWindowFocus:false,
    refetchOnReconnect:false,

    queryFn():Promise<string[]>
    {
      return getKjFiles();
    },

    select(data:string[]):string[]
    {
      return data.sort(NatCompare);
    }
  });

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

  /** call to load new session. once get new session, set it and shuffle */
  const loadNewSessionMqy=useMutation<KjStudySession,Error,string>({
    mutationFn(targetDatafile:string):Promise<KjStudySession>
    {
      return startNewSession(targetDatafile);
    },

    // set session to new session
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

  // on session change, if the selected datafile is empty and the session has a data file,
  // set the selected data file to that data file.
  // should not cause inf loop as setting it will prevent it from being called again
  useEffect(()=>{
    if (!selectedDatafile && session.datafile)
    {
      setSelectedDatafile(session.datafile);
    }
  },[session,selectedDatafile])


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

  /** selected new value in the datafile selector. set the selection */
  function h_datafileSelectorChange(e:React.ChangeEvent<HTMLSelectElement>):void
  {
    setSelectedDatafile(e.currentTarget.value);
  }

  /** clicked to load data file. call api to load new session, if a datafile is actually selected */
  function h_loadDatafileClick():void
  {
    if (!selectedDatafile || !selectedDatafile.length)
    {
      console.log("no datafile");
      return;
    }

    loadNewSessionMqy.mutateAsync(selectedDatafile);
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

  /** render the list of available data files */
  function r_datafilesList():JSX.Element[]
  {
    const elements:JSX.Element[]=_.map(datafilesListQy.data,(datafileName:string)=>{
      return <option key={datafileName} value={datafileName}>{datafileName}</option>;
    });

    elements.push(<option value="" disabled hidden/>);

    return elements;
  }



  // --- render
  return <>
    <div className="contain">
      <div className="top">
        <div className="left">
          <Button1 icon={<RefreshCcw/>} text="Shuffle Session" onClick={h_shuffleSessionButton}/>
        </div>
        <div className="right">
          <select className="data-selector" onChange={h_datafileSelectorChange}
            value={selectedDatafile}
          >
            {r_datafilesList()}
          </select>
          <Button1 icon={<ArrowRight/>} text="Load Data" onClick={h_loadDatafileClick}/>
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