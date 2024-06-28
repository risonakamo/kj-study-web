// funcs dealing with jisho url scheme

import {percentTruncate} from "./utils";

/** percent to truncate sentence when searching. adjust if failing alot */
const SentenceTruncatePercent:number=.5;

/** return url to search for a target word. also works to search for full sentence in
 *  pieces mode */
function searchForWordUrl(word:string):string
{
    return `https://jisho.org/search/${word}`;
}

/** return url to search for sentence. automatically truncates the sentence to
 *  some percent of the size for consistency */
function searchForSentenceUrl(sentence:string):string
{
    sentence=percentTruncate(sentence,SentenceTruncatePercent);
    return `https://jisho.org/search/${sentence}%20%23sentence`;
}

/** open a new tab and search for target word or sentence in pieces mode*/
export function searchForWordNewTab(word:string):void
{
    window.open(searchForWordUrl(word),"_blank");
}

/** open a new tab and search for target sentence */
export function searchForSentenceNewTab(sentence:string):void
{
    window.open(searchForSentenceUrl(sentence),"_blank");
}