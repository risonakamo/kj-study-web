import {createRoot} from "react-dom/client";
import {QueryClient,QueryClientProvider, useMutation, useQuery} from "@tanstack/react-query";
import _ from "lodash";
import {useEffect, useMemo, useRef, useState} from "react";
import {useImmer}  from "use-immer";
import {ArrowRight, RefreshCcw, ShuffleIcon} from "lucide-react";
import NatCompare from "natural-compare";
import copy from "copy-to-clipboard";

import {KjRow, KjRowRef, KjRowStatus} from "@/components/kj-row/kj-row";
import {apiSetSentenceState, apiShuffleSentences, getKjFiles, getKjSession,
  startNewSession} from "@/apis/kj-study";
import {updateSentenceListStatus} from "@/lib/word-sentence";
import {Button1} from "@/components/button1/button1";
import {searchForSentenceNewTab, searchForWordNewTab} from "@/lib/jisho-url";

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

  /** name of datafile that is selected with the datafile dropdown */
  const [selectedDatafile,setSelectedDatafile]=useState<string>("");

  /** index of the currently selected kj row, if any */
  const [selectedRow,setSelectedRow]=useState<number|null>(null);

  /** if true, visuals for keyboard selected items are shown */
  const [keyboardVisuals,setkeyboardVisuals]=useState<boolean>(false);


  // --- dervied states
  /** the current row as an obj */
  const currentRow:WordSentencePair|null=useMemo(()=>{
    if (selectedRow==null)
    {
      return null;
    }

    return session.wordSentences[selectedRow];
  },[selectedRow,session.wordSentences]);




  // --- refs
  /** refs of all the currently rendered kj rows, in order */
  const rowElements=useRef<KjRowRef[]>([]);

  /** when set, nullifys 1 instance of row hover operation */
  const nullifyHover=useRef<boolean>(false);




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
   *  words in the retrieved session, but only the first time this is called.
   *  resets selected row to 0. */
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
      setSelectedRow(0);
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

  /** call to shuffle sentences. set the state on getting new sentences. resets selected
   *  row to 0 */
  const shuffleSessionMqy=useMutation<KjStudySession>({
    mutationFn():Promise<KjStudySession>
    {
      return apiShuffleSentences();
    },

    // set the word sentences to the result
    onSuccess(data:KjStudySession):void
    {
      setSessionAndShuffle(data);
      setSelectedRow(0);
    }
  });

  /** call to load new session. once get new session, set it and shuffle. reset selected row to 0 */
  const loadNewSessionMqy=useMutation<KjStudySession,Error,string>({
    mutationFn(targetDatafile:string):Promise<KjStudySession>
    {
      return startNewSession(targetDatafile);
    },

    // set session to new session
    onSuccess(data:KjStudySession):void
    {
      setSessionAndShuffle(data);
      setSelectedRow(0);
    }
  });



  // --- effects/sync
  const sync=useRef({
    keyControl,
    h_mouseMoved
  });
  sync.current.keyControl=keyControl;
  sync.current.h_mouseMoved=h_mouseMoved;

  /** call initial session get */
  useEffect(()=>{
    getSessionMqy.mutateAsync();
  },[]);

  /** on session change, if the selected datafile is empty and the session has a data file,
      set the selected data file to that data file.
      should not cause inf loop as setting it will prevent it from being called again */
  useEffect(()=>{
    if (!selectedDatafile && session.datafile)
    {
      setSelectedDatafile(session.datafile);
    }
  },[session,selectedDatafile]);

  /** keyboard controls */
  useEffect(()=>{
    window.onkeydown=(e:KeyboardEvent)=>{
      sync.current.keyControl(e);
    };
  },[]);

  /** attach mouse move handler */
  useEffect(()=>{
    window.onmousemove=()=>{
      sync.current.h_mouseMoved();
    };
  },[]);


  // --- funcs
  /** set a session, but shuffle before doing so */
  function setSessionAndShuffle(newSession:KjStudySession):void
  {
    newSession.wordSentences=_.shuffle(newSession.wordSentences);
    setSession(newSession);
  }

  /** update in the session a word/sentence with a new status. triggers backend call to update backend */
  function updateSentence(word:string,sentence:string,newStatus:WordSentenceStatus):void
  {
    setSession((draft)=>{
      updateSentenceListStatus(
        draft.wordSentences,

        word,
        sentence,
        newStatus,
      )
    });

    updateSentenceStateMqy.mutateAsync({
      word:word,
      sentence:sentence,
      status:newStatus
    });
  }

  /** set the state of the currently selected row to some status. if the row is already the target status,
   *  toggles to normal */
  function setStatusCurrentRow(newStatus:WordSentenceStatus):void
  {
    if (currentRow==null)
    {
      return;
    }

    if (currentRow.status==newStatus)
    {
      newStatus="normal";
    }

    updateSentence(
      currentRow.word,
      currentRow.sentence,
      newStatus,
    );
  }

  /** do soft frontend sentence shuffle. performs reset X to normal */
  function shuffleSentences():void
  {
    resetXtoNormal();

    setSession((draft)=>{
      draft.wordSentences=_.shuffle(draft.wordSentences);
    });

    window.scrollTo(0,0);
    setSelectedRow(0);
  }

  /** checks if there are no more sentences in the normal state. if so, changes all sentences in the
   *  X statee to normal state. does NOT send backend update for now, backend will keep it considered
   *  as Xed */
  function resetXtoNormal():void
  {
    const foundANormal:boolean=_.some(session.wordSentences,(sentence:WordSentencePair):boolean=>{
      return sentence.status=="normal";
    });

    if (foundANormal)
    {
      return;
    }

    // did not find a normal. set all word sentences that are X to normal
    setSession((draft)=>{
      for (let i=0;i<draft.wordSentences.length;i++)
      {
        if (draft.wordSentences[i].status=="active-red")
        {
          draft.wordSentences[i].status="normal";
        }
      }
    });
  }

  /** try to navigate the current row */
  function navigateRow(rowChange:number):void
  {
    if (selectedRow==null)
    {
      return;
    }

    var newRow:number=selectedRow+rowChange;
    newRow=_.clamp(newRow,0,session.wordSentences.length-1);

    if (newRow==selectedRow)
    {
      return;
    }

    nullifyHover.current=true;

    if (rowElements.current && rowElements.current[newRow])
    {
      rowElements.current[newRow].scrollTo();
    }

    setSelectedRow(newRow);
  }





  // --- key control
  /** key controls func */
  function keyControl(e:KeyboardEvent):void
  {
    // when any key pressed, detect if it is handled by one of the key handlers.
    // if it was, then trigger some logic at the end.
    var validKeyPressed:boolean=true;

    // navigate selected row down, if there selected. call scroll to on the element at that
    // index position
    if (e.key=="ArrowDown" || e.key=="s" || e.key=="S")
    {
      e.preventDefault();

      if (keyboardVisuals)
      {
        navigateRow(1);
      }
    }

    // navigate up. call scroll to on the element at that index position.
    else if (e.key=="ArrowUp" || e.key=="w" || e.key=="W")
    {
      e.preventDefault();

      if (keyboardVisuals)
      {
        navigateRow(-1);
      }
    }

    // set item as red
    else if (e.key=="ArrowRight" || (e.ctrlKey && e.key=="Enter") || e.key=="d" || e.key=="D"
      || (e.ctrlKey && e.key==" "))
    {
      e.preventDefault();
      setStatusCurrentRow("active-red");
    }

    // set item as green
    else if (e.key=="ArrowLeft" || e.key=="Enter" || e.key=="a" || e.key=="A" || e.key==" ")
    {
      e.preventDefault();
      setStatusCurrentRow("active-green");
    }

    // sentence search for current row
    else if (e.key=="z" || e.key=="Z" || e.key==",")
    {
      if (!currentRow)
      {
        return;
      }

      searchForSentenceNewTab(currentRow.sentence);
    }

    // word search current row
    else if (e.key=="x" || e.key=="X" || e.key==".")
    {
      if (!currentRow)
      {
        return;
      }

      searchForWordNewTab(currentRow.word);
    }

    // sentence pieces search current row
    else if ((!e.ctrlKey && (e.key=="c" || e.key=="C")) || e.key=="/")
    {
      if (!currentRow)
      {
        return;
      }

      searchForWordNewTab(currentRow.sentence);
    }

    // copy current row
    else if (e.key=="v" || e.key=="V")
    {
      e.preventDefault();

      if (selectedRow==null)
      {
        return;
      }

      rowElements.current[selectedRow].doCopy();
    }

    // soft shuffle
    else if (e.key=="r" || e.key=="R")
    {
      shuffleSentences();
    }

    else
    {
      validKeyPressed=false;
    }

    // if pressed a valid key, enable keyboard visuals
    if (validKeyPressed)
    {
      setkeyboardVisuals(true);
    }
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

  /** clicked shuffle button. shuffle the sentences and scroll to top. reset selected row to 0 */
  function h_shuffleSentencesClick():void
  {
    shuffleSentences();
  }

  /** on mouse moving, set keyboard visuals to false if it is on */
  function h_mouseMoved():void
  {
    if (keyboardVisuals)
    {
      setkeyboardVisuals(false);
    }
  }




  // --- render funcs
  /** render the kj rows from the kj data list */
  function r_kjRows():JSX.Element[]
  {
    rowElements.current=[];
    return _.map(session.wordSentences,(data:WordSentencePair,i:number):JSX.Element=>{
      /** row's status changed. update the web-side state and send mqy to update the backend state */
      function h_statusChange(newStatus:KjRowStatus):void
      {
        const newStatus2:WordSentenceStatus=kjRowStatusToSentenceStatus(newStatus);

        updateSentence(
          data.word,
          data.sentence,
          newStatus2,
        );
      }

      /** hovered over a row. set it as the selected row, but only if keyboard visuals is off.
       *  also triggers on clicking the row */
      function h_rowHover():void
      {
        // nullify hover prevents hover from activating once
        if (nullifyHover.current)
        {
          nullifyHover.current=false;
          return;
        }

        if (keyboardVisuals)
        {
          return;
        }

        setSelectedRow(i);
      }

      /** clicking always sets the selected row and remove keyboard visuals */
      function h_rowClick():void
      {
        setkeyboardVisuals(false);
        setSelectedRow(i);
      }

      /** collect refs */
      function refCollect(ref:KjRowRef):void
      {
        if (ref)
        {
          rowElements.current.push(ref);
        }
      }


      // set row to selected only if keyboard visuals is on and it is selected
      const selected:boolean=keyboardVisuals && i==selectedRow;

      return <KjRow
        key={data.word+data.sentence}
        word={data.word}
        sentence={data.sentence}
        sentenceState={sentenceStatusToKjRowStatus(data.status)}
        selected={selected}
        onStatusChange={h_statusChange}
        onHover={h_rowHover}
        onClick={h_rowClick}
        ref={refCollect}
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
          <Button1 icon={<RefreshCcw/>} text="Reset Session" onClick={h_shuffleSessionButton}/>
          <Button1 icon={<ShuffleIcon/>} text="Shuffle" onClick={h_shuffleSentencesClick}/>
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

      <div className="bottom">
        <Button1 icon={<ShuffleIcon/>} text="Shuffle" onClick={h_shuffleSentencesClick}/>
      </div>
    </div>
    <div className="frame-zone">
      <iframe src="https://jisho.org/search/%E5%9B%9E%E3%82%8A%E9%81%93"/>
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