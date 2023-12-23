// --future --expose-gc
function* f1() {
    let proto = Object.getPrototypeOf(this['arguments']);
    while (proto) {
        (() => { typeof Object.getOwnPropertyDescriptor(proto, 'toString').value
})();
        proto = Object.getPrototypeOf(proto);
    }
}

function f0() {
    for (let v0 = 0; v0 < 1; v0++) {
        ~v0;
        Array.prototype.toString = v0;
        gc();
        v0 = NaN;
        for (let _ of f1()) { }
    }
}

for (let i = 0; i < 400; i++) {
    console.log(i);
    f0();
}