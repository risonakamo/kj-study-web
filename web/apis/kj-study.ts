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

/** get target kj file */
export async function getKjFile(filename:string):Promise<WordSentenceDict>
{
    return (await ax.get(`/get-kj-file/${filename}`)).data;
}