// lib for manipulating word sentence data and related types from the backend

// import _ from "lodash";

// /** convert word sentence dict to list of single word sentences */
// export function wordSentenceDictToSingles(sentenceDict:WordSentenceDict):SingleWordSentence[]
// {
//     return _.flatMap(sentenceDict,(sentences:string[],word:string):SingleWordSentence[]=>{
//         return _.map(sentences,(sentence:string):SingleWordSentence=>{
//             return {
//                 word,
//                 sentence
//             };
//         });
//     });
// }

/** mutate a word sentence pair list. find the target word/sentence, and change the status to
 *  the declared status. MUTATES the input list */
export function updateSentenceListStatus(
    sentences:WordSentencePair[],

    word:string,
    sentence:string,
    newStatus:WordSentenceStatus,
):WordSentencePair[]
{
    for (var i=0;i<sentences.length;i++)
    {
        const pair:WordSentencePair=sentences[i];

        if (pair.word==word && pair.sentence==sentence)
        {
            pair.status=newStatus;
            return sentences;
        }
    }

    console.warn("failed to find word/sentence to update with new status",word,sentence);
    return sentences;
}