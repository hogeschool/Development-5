module Basics {
  let x1: number = 100
  let x2: boolean = true
  let x3: string = "a string"
  let x4: "A" = "A"

  export let main = () => console.log(x1, x2, x3, x4)
}

module SimpleTypes {
  export type Student = { name: string, surname: string, student_code: string }
  export type Teacher = { name: string, surname: string, subject: string }
  export let pietje: Student = { name: "Pietje", surname: "Ejteip", student_code: "0099887766" }
  // (WARNING: DOES NOT COMPILE!) export let jannetje:Teacher = { name:"Pietje", surname:"Ejteip", student_code:"0099887766" }
  export let jannetje: Teacher = { name: "Jannetje", surname: "Ejtennaj", subject: "Programming 1" }

  export let main = () => console.log(JSON.stringify([pietje, jannetje]))
}

module Unions {
  let x1: number | "loading" | "error" = "loading"
  let x2: number | string = "a string"
  let x3: number | string = 101

  export type Person = SimpleTypes.Student | SimpleTypes.Teacher
  export let pietje: Person = SimpleTypes.pietje
  export let jannetje: Person = SimpleTypes.jannetje
  export let jannetje_2: Person = { name: "Jannetje", surname: "Ejtennaj", subject: "Programming 1" }

  export let main = () => console.log(JSON.stringify([pietje, jannetje]))
}

module DiscriminatedUnions {
  export type Student = { kind: "student", name: string, surname: string, student_code: string }
  export type Teacher = { kind: "teacher", name: string, surname: string, subject: string }
  export type Person = Student | Teacher
  export let pietje: Person = { ...SimpleTypes.pietje, kind: "student" }
  // (WARNING: DOES NOT COMPILE!) export let pietje_2:Person = {...SimpleTypes.pietje, kind:"teacher" }
  export let jannetje: Person = { ...SimpleTypes.jannetje, kind: "teacher" }
  export let jannetje_2: Person = { name: "Jannetje", surname: "Ejtennaj", subject: "Programming 1", kind: "teacher" }

  export let name: (_: Person) => string
    = p => p.name

  export function pretty_print(p: Person) : string {
    if (p.kind == "student") {
      return `${p.name} has a code of ${p.student_code}`
    } else {
      return `${p.name} teaches ${p.subject}`
    }
  }

  export let main = () => console.log(pretty_print(pietje), pretty_print(jannetje), pretty_print(jannetje_2))
}

module DiscriminatedUnionsAndIntersections {
  export type Person = SimpleTypes.Student & { kind: "student" } | SimpleTypes.Teacher & { kind: "teacher" }
  export let pietje: Person = { ...SimpleTypes.pietje, kind: "student" }
  // (WARNING: DOES NOT COMPILE!) export let pietje_2:Person = {...SimpleTypes.pietje, kind:"teacher" }
  export let jannetje: Person = { ...SimpleTypes.jannetje, kind: "teacher" }
  export let jannetje_2: Person = { name: "Jannetje", surname: "Ejtennaj", subject: "Programming 1", kind: "teacher" }

  export let name: (_: Person) => string
    = p => p.name

  export function pretty_print(p: Person) : string {
    if (p.kind == "student") {
      return `${p.name} has a code of ${p.student_code}`
    } else {
      return `${p.name} teaches ${p.subject}`
    }
  }

  export let main = () => console.log(pretty_print(pietje), pretty_print(jannetje), pretty_print(jannetje_2))
}

module GenericTypes {
  export type Pair<A, B> = { fst: A, snd: B }
  // export let mk_pair = function<A,B>(fst:A, snd:B) : Pair<A,B> { return { fst:fst, snd:snd } }
  export let mk_pair: <A, B>(fst: A, snd: B) => Pair<A, B> = (fst, snd) => ({ fst: fst, snd: snd })

  export let pietje_and_jannetje: Pair<SimpleTypes.Student, SimpleTypes.Teacher> =
    mk_pair(SimpleTypes.pietje, SimpleTypes.jannetje)

  export type Either<A, B> = { kind:"L", value:A } | { kind:"R", value:B }
  export let left: <A, B>(_: A) => Either<A, B> = v => ({ kind: "L", value:v })
  export let right: <A, B>(_: B) => Either<A, B> = v => ({ kind: "R", value:v })

  export let pietje_or_jannetje: Either<SimpleTypes.Student, SimpleTypes.Teacher> =
    Math.random() > 0.5 ? left(SimpleTypes.pietje) : right(SimpleTypes.jannetje)

  export let main = () => console.log(JSON.stringify([pietje_and_jannetje, pietje_or_jannetje]))
}

module GenericFunctions {
  export type Fun<A,B> = (_:A) => B
  export let pipeline : <A,B,C>(_:Fun<A,B>) => (_:Fun<B,C>) => Fun<A,C>
                      = f => g => (x => g(f(x)))

  export let incr : (_:number) => number
                  = x => x + 1
  export let double : (_:number) => number
                  = x => x * 2
  export let halve : (_:number) => number
                  = x => x / 2

  export let my_pipeline1 = pipeline(incr)(double)
  export let my_pipeline2 = pipeline(double)(incr)
  export let my_pipeline3 = pipeline(halve)(pipeline(incr)(double))
  export let my_pipeline4 = pipeline(pipeline(halve)(incr))(double)

  export let main = () => console.log(JSON.stringify([my_pipeline1(3), my_pipeline2(3), my_pipeline3(4), my_pipeline4(4)]))
}

module TypeAlgebra {
  export type Plus<A,B> = GenericTypes.Either<A,B>
  export type Times<A,B> = GenericTypes.Pair<A,B>
  export type Exp<B,A> = GenericFunctions.Fun<A,B>

  export let compose = GenericFunctions.pipeline

  export let mk_pair = GenericTypes.mk_pair

  export let first : <A,B>(_:Times<A,B>) => A
                   = x => x.fst
  export let second : <A,B>(_:Times<A,B>) => B
                    = x => x.snd

  export let times : <C,A,B>(f:Exp<A,C>, g:Exp<B,C>) => Exp<Times<A,B>, C>
                   = (f,g) => c => GenericTypes.mk_pair(f(c), g(c))

  export let times_map = function<A,B,C,D>(f:Exp<C,A>, g:Exp<D,B>) : Exp<Times<C,D>, Times<A,B>> {
    return c => GenericTypes.mk_pair<C,D>(compose<Times<A,B>, A, C>(first)(f)(c), compose<Times<A,B>, B, D>(second)(g)(c))
  }

  export let inl = GenericTypes.left
  export let inr = GenericTypes.right

  export let plus : <C,A,B>(f:Exp<C,A>, g:Exp<C,B>) => Exp<C, Plus<A,B>>
                   = (f,g) => c => c.kind == "L" ? f(c.value) : g(c.value)

  export let plus_map = function<A,B,C,D>(f:Exp<C,A>, g:Exp<D,B>) : Exp<Plus<C,D>, Plus<A,B>> {
    return plus<Plus<C,D>, A, B>(compose<A, C, Plus<C,D>>(f)(inl), compose<B, D, Plus<C,D>>(g)(inr))
  }

  export let distribute_plus_times = function<A,B,C>(p:Times<A,Plus<B,C>>) : Plus<Times<A,B>,Times<A,C>> {
    let a = first(p)
    let bc = second(p)
    return plus_map<B,C,Times<A,B>,Times<A,C>>(b => mk_pair<A,B>(a,b), c => mk_pair(a,c))(bc)
  }

  export let group_plus_times = function<A,B,C>(p:Plus<Times<A,B>,Times<A,C>>) : Times<A,Plus<B,C>> {
    return plus<Times<A,Plus<B,C>>, Times<A,B>,Times<A,C>>(
      ab => mk_pair<A,Plus<B,C>>(first(ab),inl(second(ab))),
      ac => mk_pair<A,Plus<B,C>>(first(ac),inr(second(ac))))(p)
  }

  // distribute_exp_plus
  // group_exp_plus
}

// Basics.main()
// SimpleTypes.main()
// Unions.main()
// DiscriminatedUnionsAndIntersections.main()
// GenericTypes.main()
GenericFunctions.main()
