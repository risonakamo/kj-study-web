import _ from "lodash";

/** truncate a string to a percent length, rounded up. percent should be 0-1 */
export function percentTruncate(input:string,size:number):string
{
    const newSize:number=Math.ceil(input.length*size);

    return input.slice(0,newSize);
}

/** add to end of a url a seed query. for iframe src change to work */
export function addUrlSeed(url:string):string
{
    const params=new URL(url);
    params.searchParams.append("rand",_.random(1,10000).toString());

    return params.toString();
}