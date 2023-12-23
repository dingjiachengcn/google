
function outer(){}
function foo() {
    function obj1(obj2) {
    }
    const obj4 = outer();
    function obj5(obj6) {
    }
    const obj8 = outer();
    const obj10 = outer();
    const obj14 = {};
    const obj15 = {a:42};
    const obj16 = {a:42};
    const obj17 = {a:42};
    const obj18 = {a:42};
    const obj19 = {a:42};
    function obj20(obj21,obj22) {
        return obj15;
    }
    const obj23 = obj19.g;
    obj18.f = obj14;
    obj18.g = obj14;
    const obj24 = obj16.a;
    obj16.e = obj14;
    obj16.a = obj14;
    obj16.d = 13.37;
    obj18.a = 42;
    obj18.e = obj14;
    obj18.b = obj14;
    obj18.e = 42;
    const obj25 = obj19.a;
    obj16.e = 13.37;
    obj16.a = 42;
    for (let obj29 = 0; obj29 < 100; obj29++) {
        const obj30 = obj20();
    }
    const obj31 = {a:42};
    const obj32 = obj17.d;
    const obj33 = {a:42};
    obj16.e = 42;
    const obj34 = obj20();
    obj18.e = 42;
    const obj35 = obj20(obj17);
    obj34.e = 42;
    function obj36(obj37,obj38) {
        return obj17;
    }
    const obj39 = obj18.d;
    const obj40 = obj19.a;
    obj35.a = obj14;
    obj35.a = 42;
    function obj41(obj42,obj43,obj44,...obj45) {
    }
    const obj47 = Object();
    obj47.m = obj41;
    obj16.b = 42;
    const obj50 = {a:42};
    const obj51 = {a:42};
    function obj52(obj53,obj54) {
    }
    const obj55 = obj20();
    obj51.c = 13.37;
    const obj56 = obj52(obj51);
    obj35.b = 42;
    obj35.a = 42;
    obj19.e = 13.37;
    obj19.c = obj14;
    obj19.b = 42;
    obj19.b = obj14;
    obj16.b = 42;
    obj16.d = 42;
    const obj57 = obj36(obj33);
    function obj58(obj59,obj60) {
    }
    obj35.c = 13.37;
    obj35.d = 13.37;
    obj35.c = 42;
    obj35.c = 42;
    obj17.b = obj14;
    obj17.f = 42;
    obj17.b = obj14;
    obj17.c = 42;
    obj19.d = 42;
    obj35.f = 42;
    obj35.b = 13.37;
    const obj61 = obj34.g;
    const obj62 = obj20(obj17);
    obj19.g = 42;
    obj19.d = 42;
    obj57.f = 42;
    obj57.d = obj14;
    obj57.a = 42;
    obj57.d = obj14;
    const obj63 = obj20(obj33);
    for (let obj67 = 0; obj67 < 100; obj67++) {
        const obj68 = obj20(obj33);
    }
    const obj69 = obj58(obj34);
    obj33.f = 42;
    obj33.g = 13.37;
    obj33.a = 13.37;
    const obj70 = obj20(obj33);
    const obj71 = obj58(obj31);
    obj15.g = 13.37;
    obj15.g = 13.37;
    for (let obj75 = 0; obj75 < 100; obj75++) {
        const obj76 = obj36(obj71);
    }
    const obj77 = obj16.c;
    function obj78(obj79,obj80) {
        const obj81 = obj20(obj19);
        const obj82 = obj36();
        obj80.c = obj14;
        return obj69;
    }
    const obj83 = 1337;
    const obj85 = 13.37;
    const obj86 = {};
    const obj87 = {a:1};
    function obj88(obj89,obj90) {
        return obj87;
    }
    const obj92 = {a:42};
    const obj93 = {a:42};
    function obj94(obj95,obj96) {
    }
    const obj97 = {a:42};
    const obj98 = obj94(obj93);
    const obj99 = {a:1};
    function obj100(obj101,obj102) {
    }
    const obj103 = obj100(obj99);
    function obj104(obj105,obj106) {
    }
    function obj107(obj108,obj109) {
    }
    const obj110 = obj104(obj98);
    function obj111(obj112,obj113) {
    }
    const obj114 = {a:100};
    const obj115 = obj111(obj114);
    const obj117 = Object();
    obj117.n = obj88;
    const obj118 = 0;
    const obj119 = obj107(obj97);
    function obj120(obj121,obj122) {
    }
    const obj124 = {a:42};
    function obj125(obj126,obj127) {
    }
    const obj128 = obj125(obj124);
    const obj130 = {a:42};
    const obj131 = {a:42};
    function obj132(obj133,obj134) {
    }
    const obj135 = obj120(obj130);
    const obj136 = 100;
    const obj137 = obj132(obj131);
    function obj138(obj139,obj140) {
    }
    const obj141 = obj138(obj131);
    const obj142 = new Int32Array();
    let obj143 = 0;
    while (1 == 1) {
        const obj146 = obj143 < 5000;
        if (obj146) {
            const obj147 = obj1(obj142);
        } else {
            break;
        }
        const obj148 = ++obj143;
    }
    const obj149 = obj5();
    const obj151 = {a:42};
    function obj152(obj153,obj154) {
    }
    const obj155 = obj152(obj151);
}
foo();
foo();
// flag: --maglev --single-threaded