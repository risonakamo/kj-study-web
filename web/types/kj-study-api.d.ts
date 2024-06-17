// types from kj study api

/** word-sentence dict. contains multiple words, and each word has a list of sentences
    key: a word
    val: sentences of that word */
type WordSentenceDict=Record<string,string[]>