// lib for manipulating word sentence data type

import _ from "lodash";

/** convert word sentence dict to list of single word sentences */
export function wordSentenceDictToSingles(sentenceDict:WordSentenceDict):SingleWordSentence[]
{
    return _.flatMap(sentenceDict,(sentences:string[],word:string):SingleWordSentence[]=>{
        return _.map(sentences,(sentence:string):SingleWordSentence=>{
            return {
                word,
                sentence
            };
        });
    });
}