// --allow-natives-syntax  --verify-heap  --expose-gc
function main() {
	const registry = new FinalizationRegistry(()=>{console.log("call cb")});
	const token = {a:"v8"};
	registry.register([],undefined,token);
	new WebAssembly.Memory({initial:1337});
	registry.register([]);

	registry.unregister(token);


	return registry;
}
r = main();
gc();


// %DebugPrint(token);
// #
// # Fatal error in ../../src/heap/mark-compact.cc, line 288
// # Check failed: marking_state_->IsBlackOrGrey(heap_object).
// #
// #
// #
// #FailureMessage Object: 0x7fff875b1ba0