const code = new Uint8Array([0,97,115,109,1,0,0,0,1,7,1,96,2,127,127,1,126,2,13,1,3,109,101,109,3,109,101,109,2,0,128,8,3,2,1,0,7,8,1,4,109,97,105,110,0,0,10,10,1,8,0,32,0,32,1,112,172,11,11,1,0]);

let memory = new WebAssembly.Memory({
    initial: 1024
})
const module = new WebAssembly.Module(code);
const instance = new WebAssembly.Instance(module, {
    mem: {
        mem: memory
    }
});

print(instance.exports.main(-2147483648,-1));