import "./kj-row.styl";

interface KjRowProps
{

}

/** main row element containing a sentence and all controls for interacting with the sentence */
export function KjRow(props:KjRowProps):JSX.Element
{
  return <div className="kj-row">
    <div className="sentence-contain">
      example sentence
    </div>

    <div className="control">
      <div className="left">
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