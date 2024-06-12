// funcs dealing with jisho url scheme

import {percentTruncate} from "./utils";

/** percent to truncate sentence when searching. adjust if failing alot */
const SentenceTruncatePercent:number=.5;

/** return url to search for a target word */
export function searchForWordUrl(word:string):string
{
    return `https://jisho.org/search/${word}`;
}

/** return url to search for sentence. automatically truncates the sentence to
 *  some percent of the size for consistency */
export function searchForSentenceUrl(sentence:string):string
{
    sentence=percentTruncate(sentence,SentenceTruncatePercent);
    return `https://jisho.org/search/${sentence}%20%23sentence`;
}