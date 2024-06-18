import {createRoot} from "react-dom/client";
import {QueryClient,QueryClientProvider, useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import _ from "lodash";

import {KjRow} from "@/components/kj-row/kj-row";
import {getKjFile} from "@/apis/kj-study";
import {wordSentenceDictToSingles} from "@/lib/word-sentence";

import "./kj-study-index.styl";

function KjStudyIndex():JSX.Element
{
  /** the kj data for the select data file */
  const kjDataQy=useQuery<WordSentenceDict>({
    queryKey:["kj-data","1"],

    initialData:{},

    // refetchOnMount:false,
    refetchOnWindowFocus:false,
    refetchOnReconnect:false,

    async queryFn():Promise<WordSentenceDict>
    {
      console.log("huh");
      return getKjFile("1");
    }
  });

  /** the dervied single word sentence list from kj data. shuffled */
  const kjDataList:SingleWordSentence[]=useMemo(()=>{
    return _.shuffle(wordSentenceDictToSingles(kjDataQy.data));
  },[kjDataQy.data]);

  /** render the kj rows from the kj data list */
  function r_kjRows():JSX.Element[]
  {
    return _.map(kjDataList,(data:SingleWordSentence):JSX.Element=>{
      return <KjRow key={data.word} word={data.word} sentence={data.sentence}/>;
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

function main()
{
  createRoot(document.querySelector("main")!).render(
    <QueryClientProvider client={new QueryClient()}>
      <KjStudyIndex/>
    </QueryClientProvider>
  );
}

window.onload=main;