function placeholder(){return {};}
function PrepareFunctionForOptimization(a){%PrepareFunctionForOptimization(a);}
function OptimizeFunctionOnNextCall(a){%OptimizeFunctionOnNextCall(a);}
function NeverOptimizeFunction(a){%NeverOptimizeFunction(a);}
function DeoptimizeFunction(a){%DeoptimizeFunction(a);}
function DeoptimizeNow(){%DeoptimizeNow();}
function OptimizeOsr(){%OptimizeOsr();}
function main() {
const v0 = isNaN;
const v2 = [-128,-128];
const v3 = /(.\d?)/gsiy;
const v6 = new Uint32Array(43434);
const v7 = [43434,43434,43434,43434,43434];
const v9 = [1.7976931348623157e+308,1.7976931348623157e+308,1.7976931348623157e+308];
let v10 = 21752;
let v13 = -1690956919;
for (let v14 = -400582572; v14 < 5; v14 = v14 + v13) {
    v13 *= v14;
}
const v15 = {};
let v16 = [v15,v15,v15,v15];
const v17 = {};
const v18 = [v16,v17,v17,v17];
let v19 = {};
const v20 = {};
const v21 = {};
const v23 = new Uint8Array(v20);
const v27 = Date();
const v29 = String["fromCharCode"](...v23,128,128,v27,Date);
const v31 = `65537${v21}__proto__${v29}POSITIVE_INFINITY${v29}b5Jmc791OW`.toLowerCase(...v29);
const v33 = String(8152);
function v34(v35,v36) {
    'use asm';
    const v40 = [-1000000000000.0,-1000000000000.0,-1000000000000.0,0,v34];
    const v41 = [v40,`65537${v21}__proto__${v29}POSITIVE_INFINITY${v29}b5Jmc791OW`,v33,v31];
    const v42 = v41.toLocaleString();
    const v44 = v42["replace"](-1000000000000.0,v42);
    const v46 = eval(v44);
}
const v48 = new Promise(v34);
for (const v49 of v18) {
    function v50(v51,v52) {
        'use asm';
        'use strict';
        let v53 = `
        `;
        const v55 = [-44090.75270150066];
        const v57 = [127,127];
        const v59 = new Uint8Array(v55);
        const v65 = Date();
        const v67 = String["fromCharCode"](...v59,599442392,Promise,v65,ReferenceError);
        const v69 = "fromCharCode".localeCompare(v67,"toString",v57);
        const v74 = new Uint32Array(8461);
        for (let v77 = 1; v77 < 9411; v77++) {
            do {
                for (let v79 = v77; v79 < v77; v79++) {
                }
            } while (v77 < v77);
        }
        for (let v81 = -1980524602; v81 < 100; v81 = v81 * 709985430) {
            ({"__proto__":v52,"constructor":v81,"dotAll":v53,"length":v19,"size":v51,"toStringTag":v10,} = v16);
            v16 = v81;
            function v82(v83,v84) {
                'use asm';
            }
        }
    }
    const v86 = OptimizeFunctionOnNextCall(v50);
    function v87(v88) {
        'use asm';
    }
    const v89 = v50(v50,v87);
}
gc();
}
main();
// CRASH INFO
// ==========
// TERMSIG: 11
// STDERR:
// Received signal 11 SEGV_ACCERR 0000217441ed
// ==== C stack trace ===============================
//  [0x000056b67d6b]
//  [0x0000f7f14570]
//  [0x0000572805f7]
//  [0x0000574f73c4]
//  [0x0000574f725c]
//  [0x00005710dfb5]
//  [0x000057110036]
//  [0x000058800a4d]
//  [0x00005861bd6e]
//  [0x00005860ea9b]
//  [0x00005860e761]
//  [0x000056ddb383]
//  [0x000056df7656]
//  [0x000056f2f247]
//  [0x0000570c28cd]
//  [0x000057cb7448]
//  [0x000057cb6d00]
//  [0x000058d70277]
//  [0x0000286844aa]
//  [0x000058cf6221]
//  [0x000058cf6221]
//  [0x000058cf477c]
//  [0x000058cf45a5]
//  [0x00005703ddcf]
//  [0x000057040bd3]
//  [0x000056b91ab8]
//  [0x000056b910b2]
//  [0x000056a99283]
//  [0x000056ab9ce9]
//  [0x000056abf2c5]
//  [0x000056ac200e]
//  [0x0000f7bc5ed5]
// [end of stack trace]
