using System;
using System.Linq;

namespace OptionMonad
{
  public interface Option<T> { U Visit<U>(Func<U> onNone, Func<T, U> onSome); }
  public class None<T> : Option<T>
  {
    U Option<T>.Visit<U>(Func<U> onNone, Func<T, U> onSome)
    {
      return onNone();
    }
    override public string ToString() { return "[]"; }
  }

  public class Some<T> : Option<T>
  {
    T x;
    public Some(T x) { this.x = x; }

    public U Visit<U>(Func<U> onNone, Func<T, U> onSome)
    {
      return onSome(this.x);
    }

    override public string ToString() { return $"[{this.x}]"; }
  }

  static public class OptionExtensions
  {
    static public Option<U> Select<T, U>(this Option<T> v, Func<T, U> f)
    {
      return v.Visit<Option<U>>(() => new None<U>(), x => new Some<U>(f(x)));
    }

    static public Option<T> Join<T>(this Option<Option<T>> v)
    {
      return v.Visit<Option<T>>(() => new None<T>(), x => x.Visit<Option<T>>(() => new None<T>(), y => x));
    }

    public static Option<V> SelectMany<T, U, V>(this Option<T> v, Func<T, Option<U>> k, Func<T, U, V> f)
    {
      var v1 = v.Select(k).Join();
      var v2 = v.Select(x => v1.Select(y => f(x, y)));
      return v2.Join();
    }

    static public Option<T> ToOption<T>(this T x) { return new Some<T>(x); }
  }

  class Program
  {
    static void Main(string[] args)
    {
      var v =
        from x in (20.ToOption())
        from y in (4.ToOption())
        select x / y;
      Console.WriteLine(v);
    }
  }
}
