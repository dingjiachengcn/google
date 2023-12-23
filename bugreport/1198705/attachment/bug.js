// the first function exists to generate the SpeculativeSafeIntegerAdd node
function bar(a,b) { 
    a = a|0;
    b = b|0;
    var x = a*(2**30) + b; // constrain x to be an integer
    x = Math.min(Math.max(x,0),4503599627370496) // further constrain to kAdditiveSafeInteger
    return (x+x)|0; // the actual addition, plus the truncation to Word32
}

function foo(a,b) {
    a = a|0;
    a = Math.min(Math.max(a,4194304),4194304);
    b = b|0;
    b = Math.min(Math.max(b,2**30-2),2**30); // these constraints will mean that x has type Range(4503599627370496, 4503599627370496)
    // the result of bar will be typed to the intersection of
    // Range(-9007199254740991, 9007199254740991) and Range(9007199254740992, 9007199254740992)
    // which is empty; the dead code elimination emits a Throw
    return bar(a,b);
}
    %PrepareFunctionForOptimization(bar);
bar(0,1,0);
    %OptimizeFunctionOnNextCall(bar);
bar(0,1,0);


%PrepareFunctionForOptimization(foo);
console.log(foo(0,2**29-1));
%OptimizeFunctionOnNextCall(foo);
console.log(foo(0,2**29-1));
