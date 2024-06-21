// funcs interacting with kj study server api

import axios from "axios";

const ax=axios.create({
    baseURL:`http://${window.location.hostname}:4200`,
});

/** get kj files list */
export async function getKjFiles():Promise<string[]>
{
    return (await ax.get("/get-kj-files")).data;
}

/** get the session */
export async function getKjSession():Promise<KjStudySession>
{
    return (await ax.get("/get-session")).data;
}

/** send request to set the sentence state */
export async function apiSetSentenceState(
    word:string,
    sentence:string,
    newState:WordSentenceStatus
):Promise<void>
{
    const data:WordSentencePair={
        word,
        sentence,
        status:newState
    };

    return ax.post("/set-sentence-state",data);
}