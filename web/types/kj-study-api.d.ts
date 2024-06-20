// types from kj study api

/** possible conditions a sentence can be in */
type WordSentenceStatus=
    | "normal"
    | "active-green"
    | "active-red"

/** word-sentence dict. contains multiple words, and each word has a list of sentences
    key: a word
    val: sentences of that word */
type WordSentenceDict=Record<string,string[]>

/** program state from backend */
interface KjStudySession
{
    wordSentences:WordSentencePair[]
}

/** info about a sentence */
interface WordSentencePair
{
    word:string
    sentence:string
    status:WordSentenceStatus
}