import {expect, test} from "vitest";

import {percentTruncate} from "@/lib/utils";
import _, {result} from "lodash";

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

    const results:string[]=_.map(inputs,(input:[string,number]):string=>{
        const result:string=percentTruncate(input[0],input[1]);

        console.log(
            input,
            "->",
            result
        );

        return result;
    });

    expect(results).toMatchSnapshot();
});