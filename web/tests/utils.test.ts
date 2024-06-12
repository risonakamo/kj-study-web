import {test} from "vitest";

import {percentTruncate} from "@/lib/utils";

test("percent-truncate",()=>{
    const inputs:[string,number][]=[
        ["something",.75],
        ["something",101],
        ["huh",.75],
        ["",.5],
        ["a",1],
        ["a",.5],
        ["a",.0000001],
        [" adlsn asdfnkas dfaksgd",0],
        [" adlsn asdfnkas dfaksgd",.25]
    ];

    for (let i=0;i<inputs.length;i++)
    {
        console.log(
            inputs[i],
            "->",
            percentTruncate(inputs[i][0],inputs[i][1])
        );
    }
});