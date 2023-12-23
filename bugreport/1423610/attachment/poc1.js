// --future --expose-gc
function f0() {
    for (let v0 = 0; v0 < 1; v0++) {
        ~v0;
        Array.prototype.toString = v0;
        v0 = NaN;
        gc();
        print(Array.prototype.toString);
    }
}
f0();
%PrepareFunctionForOptimization(f0);
f0();
%OptimizeMaglevOnNextCall(f0);
f0();
