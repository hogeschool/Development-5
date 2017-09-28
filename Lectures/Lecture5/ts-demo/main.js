"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var Basics;
(function (Basics) {
    var x1 = 100;
    var x2 = 100;
    var x3 = "100";
    var x4 = "nothing";
    Basics.main = function () { return console.log(x1, x2, x3, x4); };
})(Basics || (Basics = {}));
var SimpleTypes;
(function (SimpleTypes) {
    SimpleTypes.pietje = { name: "Pietje", surname: "Ejteip", student_code: "0099887766" };
    // (WARNING: DOES NOT COMPILE!) export let jannetje:Teacher = { name:"Pietje", surname:"Ejteip", student_code:"0099887766" }
    SimpleTypes.jannetje = { name: "Jannetje", surname: "Ejtennaj", subject: "Programming 1" };
    SimpleTypes.main = function () { return console.log(JSON.stringify([SimpleTypes.pietje, SimpleTypes.jannetje])); };
})(SimpleTypes || (SimpleTypes = {}));
var Unions;
(function (Unions) {
    Unions.pietje = SimpleTypes.pietje;
    Unions.jannetje = SimpleTypes.jannetje;
    Unions.jannetje_2 = { name: "Jannetje", surname: "Ejtennaj", subject: "Programming 1" };
    Unions.main = function () { return console.log(JSON.stringify([Unions.pietje, Unions.jannetje])); };
})(Unions || (Unions = {}));
var DiscriminatedUnionsAndIntersections;
(function (DiscriminatedUnionsAndIntersections) {
    DiscriminatedUnionsAndIntersections.pietje = __assign({}, SimpleTypes.pietje, { kind: "student" });
    // (WARNING: DOES NOT COMPILE!) export let pietje_2:Person = {...SimpleTypes.pietje, kind:"teacher" }
    DiscriminatedUnionsAndIntersections.jannetje = __assign({}, SimpleTypes.jannetje, { kind: "teacher" });
    DiscriminatedUnionsAndIntersections.jannetje_2 = { name: "Jannetje", surname: "Ejtennaj", subject: "Programming 1", kind: "teacher" };
    DiscriminatedUnionsAndIntersections.name = function (p) { return p.name; };
    function pretty_print(p) {
        if (p.kind == "student") {
            return p.name + " has a code of " + p.student_code;
        }
        else {
            return p.name + " teaches " + p.subject;
        }
    }
    DiscriminatedUnionsAndIntersections.pretty_print = pretty_print;
    DiscriminatedUnionsAndIntersections.main = function () { return console.log(pretty_print(DiscriminatedUnionsAndIntersections.pietje), pretty_print(DiscriminatedUnionsAndIntersections.jannetje), pretty_print(DiscriminatedUnionsAndIntersections.jannetje_2)); };
})(DiscriminatedUnionsAndIntersections || (DiscriminatedUnionsAndIntersections = {}));
var GenericTypes;
(function (GenericTypes) {
    // export let mk_pair = function<A,B>(fst:A, snd:B) : Pair<A,B> { return { fst:fst, snd:snd } }
    GenericTypes.mk_pair = function (fst, snd) { return ({ fst: fst, snd: snd }); };
    GenericTypes.pietje_and_jannetje = GenericTypes.mk_pair(SimpleTypes.pietje, SimpleTypes.jannetje);
    GenericTypes.left = function (v) { return ({ kind: "L", value: v }); };
    GenericTypes.right = function (v) { return ({ kind: "R", value: v }); };
    GenericTypes.pietje_or_jannetje = Math.random() > 0.5 ? GenericTypes.left(SimpleTypes.pietje) : GenericTypes.right(SimpleTypes.jannetje);
    GenericTypes.main = function () { return console.log(JSON.stringify([GenericTypes.pietje_and_jannetje, GenericTypes.pietje_or_jannetje])); };
})(GenericTypes || (GenericTypes = {}));
var GenericFunctions;
(function (GenericFunctions) {
    GenericFunctions.pipeline = function (f) { return function (g) { return (function (x) { return g(f(x)); }); }; };
    GenericFunctions.incr = function (x) { return x + 1; };
    GenericFunctions.double = function (x) { return x * 2; };
    GenericFunctions.halve = function (x) { return x / 2; };
    GenericFunctions.my_pipeline1 = GenericFunctions.pipeline(GenericFunctions.incr)(GenericFunctions.double);
    GenericFunctions.my_pipeline2 = GenericFunctions.pipeline(GenericFunctions.double)(GenericFunctions.incr);
    GenericFunctions.my_pipeline3 = GenericFunctions.pipeline(GenericFunctions.halve)(GenericFunctions.pipeline(GenericFunctions.incr)(GenericFunctions.double));
    GenericFunctions.my_pipeline4 = GenericFunctions.pipeline(GenericFunctions.pipeline(GenericFunctions.halve)(GenericFunctions.incr))(GenericFunctions.double);
    GenericFunctions.main = function () { return console.log(JSON.stringify([GenericFunctions.my_pipeline1(3), GenericFunctions.my_pipeline2(3), GenericFunctions.my_pipeline3(4), GenericFunctions.my_pipeline4(4)])); };
})(GenericFunctions || (GenericFunctions = {}));
var TypeAlgebra;
(function (TypeAlgebra) {
    TypeAlgebra.compose = GenericFunctions.pipeline;
    TypeAlgebra.first = function (x) { return x.fst; };
    TypeAlgebra.second = function (x) { return x.snd; };
    TypeAlgebra.times = function (f, g) { return function (c) { return GenericTypes.mk_pair(f(c), g(c)); }; };
    TypeAlgebra.times_map = function (f, g) {
        return function (c) { return GenericTypes.mk_pair(TypeAlgebra.compose(TypeAlgebra.first)(f)(c), TypeAlgebra.compose(TypeAlgebra.second)(g)(c)); };
    };
    TypeAlgebra.inl = GenericTypes.left;
    TypeAlgebra.inr = GenericTypes.right;
    TypeAlgebra.plus = function (f, g) { return function (c) { return c.kind == "L" ? f(c.value) : g(c.value); }; };
    TypeAlgebra.plus_map = function (f, g) {
        return TypeAlgebra.plus(TypeAlgebra.compose(f)(TypeAlgebra.inl), TypeAlgebra.compose(g)(TypeAlgebra.inr));
    };
    // export let distribute_plus_times = function<A,B,C>(p:Times<A,Plus<B,C>>) : Plus<Times<A,B>,Times<A,C>> {
    //   let x = first(p)
    //   let y = second(p)
    //   return plus_map<B,C,Times<A,B>,Times<A,C>>()(y)
    // }
    // distribute_plus_times
    // group_plus_times
    // distribute_exp_plus
    // group_exp_plus
})(TypeAlgebra || (TypeAlgebra = {}));
// Basics.main()
// SimpleTypes.main()
// Unions.main()
// DiscriminatedUnionsAndIntersections.main()
// GenericTypes.main()
GenericFunctions.main();
