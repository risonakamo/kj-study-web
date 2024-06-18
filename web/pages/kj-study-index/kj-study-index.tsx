import {createRoot} from "react-dom/client";

import {KjRow} from "@/components/kj-row/kj-row";

import "./kj-study-index.styl";

function KjStudyIndex():JSX.Element
{
  return <>
    <div className="top">

    </div>
    <div className="kj-rows">
      <KjRow
        sentence="子どもの頃、絵本で海の宮殿の物語を読んで、どんなところなのだろうと想像していた。"
        word="名所"
      />
      <KjRow
        sentence="子どもの頃、絵本で海の宮殿の物語を読んで、どんなところなのだろうと想像していた。"
        word="名所"
      />
      <KjRow
        sentence="子どもの頃、絵本で海の宮殿の物語を読んで、どんなところなのだろうと想像していた。"
        word="名所"
      />
      <KjRow
        sentence="子どもの頃、絵本で海の宮殿の物語を読んで、どんなところなのだろうと想像していた。"
        word="名所"
      />
      <KjRow
        sentence="子どもの頃、絵本で海の宮殿の物語を読んで、どんなところなのだろうと想像していた。"
        word="名所"
      />
    </div>
  </>;
}

function main()
{
  createRoot(document.querySelector("main")!).render(<KjStudyIndex/>);
}

window.onload=main;