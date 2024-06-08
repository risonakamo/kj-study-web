import {test,expect,assert} from "vitest";

import {splitSentenceOnWord} from "@/lib/sentence-lib";

test("split-sentence",()=>{
    const sentence:string="彼は茶碗を床にたたきつけた。";

    const result:string[]=splitSentenceOnWord(
        sentence,
        "茶碗"
    );

    console.log(result);

    if (result.length!=3)
    {
        assert.fail("unexpected split sentence result length");
    }

    const result2:string[]=splitSentenceOnWord(sentence,"何");

    if (result2.length!=1)
    {
        assert.fail("unexpected split sentence result length");
    }

    console.log(result2);
});