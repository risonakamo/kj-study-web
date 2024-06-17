import {createRoot} from "react-dom/client";

import "./kj-study-index.styl";

function KjStudyIndex():JSX.Element
{
  return <>
    hello
  </>;
}

function main()
{
  createRoot(document.querySelector("main")!).render(<KjStudyIndex/>);
}

window.onload=main;