import _ from "lodash";

/** add to end of a url a seed query. for iframe src change to work */
export function addUrlSeed(url:string):string
{
    const params=new URL(url);
    params.searchParams.append("rand",_.random(1,10000).toString());

    return params.toString();
}