// lib for manipulating word sentence data type
// deprecated for now, as backend sends in word sentence pair form already

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