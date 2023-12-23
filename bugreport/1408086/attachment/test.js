const obj1 = {a:42};
const obj2 = {a:42};
function foo() {
    obj1.a = 13.37;
    return obj2;
}
let obj3 = 1337;
class c1 extends foo {
    obj3 = 1;
}
new c1();

// #
// # Fatal error in ..\..\src\ic\ic.cc, line 1757
// # Debug check failed: IsDefineNamedOwnIC() implies it.IsFound() && it.HolderIsReceiver().
// #
// #
// #
// #FailureMessage Object: 000011D233258440
// ==== C stack trace ===============================

//         v8::base::debug::StackTrace::StackTrace [0x00007FF6F6B2AF73+35] (C:\b\s\w\ir\cache\builder\v8\src\base\debug\stack_trace_win.cc:173)
//         v8::platform::`anonymous namespace'::PrintStackTrace [0x00007FF6F69DE83D+349] (C:\b\s\w\ir\cache\builder\v8\src\libplatform\default-platform.cc:28)
//         V8_Fatal [0x00007FF6F69B56FB+539] (C:\b\s\w\ir\cache\builder\v8\src\base\logging.cc:164)
//         v8::base::`anonymous namespace'::DefaultDcheckHandler [0x00007FF6F69B4978+40] (C:\b\s\w\ir\cache\builder\v8\src\base\logging.cc:57)
//         v8::internal::StoreIC::Store [0x00007FF6F2DB0308+1240] (C:\b\s\w\ir\cache\builder\v8\src\ic\ic.cc:1757)
//         v8::internal::__RT_impl_Runtime_DefineNamedOwnIC_Miss [0x00007FF6F2DE081B+2395] (C:\b\s\w\ir\cache\builder\v8\src\ic\ic.cc:2833)
//         v8::internal::Runtime_DefineNamedOwnIC_Miss [0x00007FF6F2DDF254+612] (C:\b\s\w\ir\cache\builder\v8\src\ic\ic.cc:2805)
//         (No symbol) [0x00007FF67FE7343C]