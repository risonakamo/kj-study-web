// funcs for truncating sentence

import _ from "lodash";

/** split sentences on these symbols */
const SplitReg:RegExp=/[、。]/;

/** when truncating, keep above this size */
const SentenceMinSize:number=10;

const DefaultTruncatePercent:number=.5;

/** special jisho truncate */
export function jishoTruncate(input:string):string
{
    // split sentence into fragments based on selected set of symbols
    const fragments:string[]=input.split(SplitReg);

    // find the largest fragment
    const largestFragment:string|undefined=_.maxBy(fragments,
    (fragment:string):number=>{
        return fragment.length;
    });

    if (!largestFragment)
    {
        return "";
    }

    // try truncating the fragment to percentage size
    const truncated:string=percentTruncate(largestFragment,DefaultTruncatePercent);

    // take this truncated if it is above the min size
    if (truncated.length>SentenceMinSize)
    {
        return truncated;
    }

    // otherwise, return the largest fragment truncated to the min size (if it is
    // even that long)
    return largestFragment.slice(0,SentenceMinSize);
}

/** truncate a string to a percent length, rounded up. percent should be 0-1 */
function percentTruncate(input:string,size:number):string
{
    const newSize:number=Math.ceil(input.length*size);

    return input.slice(0,newSize);
}