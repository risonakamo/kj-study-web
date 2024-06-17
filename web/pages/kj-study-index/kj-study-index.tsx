import {createRoot} from "react-dom/client";
import { useEffect } from "react";

import {getKjFile} from "@/apis/kj-study";

import "./kj-study-index.styl";

function KjStudyIndex():JSX.Element
{
  useEffect(()=>{
    (async ()=>{
      console.log(await getKjFile("1"));
    })();
  },[]);

  return <>
    hello
  </>;
}

function main()
{
  createRoot(document.querySelector("main")!).render(<KjStudyIndex/>);
}

window.onload=main;