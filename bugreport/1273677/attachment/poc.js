function inlinee(value) {
}
function reflect() {
}
function test(arr) {
    var object = [];
    object[1448971590];
}
for (let i = 0; i < 10000; i++) {
    for (let j = 0; j < 1 + i % 100; j++)
        reflect(j, j);
    test(i, i);
}
let iterCount = 4294967297;
for (let [...x] of [
    --test(inlinee, "apply")
]) {
}