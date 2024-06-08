// functions for manipulating sentences

/** given a sentence, split it into pieces on a target word. the word will remain in the split. */
export function splitSentenceOnWord(sentence:string,word:string):string[]
{
    return sentence.split(new RegExp(`(${word})`));
}