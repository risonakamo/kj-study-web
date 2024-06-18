// types for word sentence dict, but NOT from backend. kind of weird because word
// sentence doesn't live in here... but it is from backend so kind of needs to be with
// api types file...

/** word and sentence combination */
interface SingleWordSentence
{
    word:string
    sentence:string
}