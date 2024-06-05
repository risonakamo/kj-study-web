// used for react webpage development

import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";
import {LogLevel,RollupLog,LogHandler} from "rollup";

declare const __dirname:string;

export default defineConfig({
    root:`${__dirname}/web/html`,
    mode:"development",

    plugins:[
        react(),
        checker({
            typescript:true
        }),
        tsconfigPaths()
    ],

    resolve:{
        alias:{
            css:`${__dirname}/web/css`,
            assets:`${__dirname}/web/assets`
        }
    },

    build:{
        outDir:`${__dirname}/build`,
        target:["esnext"],
        sourcemap:true,
        // emptyOutDir:true,
        minify:false,

        rollupOptions:{
            input:{
                // "index":`${__dirname}/web/html/index.html`,
            },

            onLog(level:LogLevel,log:RollupLog,handler:LogHandler):void
            {
                if (log.message.includes("Error when using sourcemap for reporting"))
                {
                    return;
                }

                handler(level,log);
            }
        }
    }
});