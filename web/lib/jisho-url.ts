// funcs dealing with jisho url scheme

import {percentTruncate} from "./utils";

/** return url to search for a target word */
export function searchForWordUrl(word:string):string
{
    return `https://jisho.org/search/${word}`;
}

/** return url to search for sentence. automatically truncates the sentence to
 *  75% of the size for consistency */
export function searchForSentenceUrl(sentence:string):string
{
    sentence=percentTruncate(sentence,.75);
    return `https://jisho.org/search/${sentence}%20%23sentences`;
}