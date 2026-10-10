### WHAT

Overloading occurs when several methods share a name but have different parameter lists.

```java
String select(Parent value) { return "Parent"; }
String select(Child value)  { return "Child"; }
```

### HOW — how the compiler chooses an overload

The compiler uses the **compile-time type of the arguments** together with invocation conversions to choose a signature. The runtime object does not cause Java to reconsider a different overload later.

```java
Parent value = new Child();
select(value); // select(Parent)
```

Although the runtime object is `Child`, the expression `value` has compile-time type `Parent`, so `select(Parent)` is bound at compile time.

### BOUNDARY — this chapter does not replace full overload-resolution rules

The OOP goal is to contrast **compile-time overload selection** with **runtime override dispatch**. Detailed rules for widening, boxing, varargs, most-specific methods, and ambiguity belong to `language-basics → Methods`.

### EVIDENCE — `DispatchController#overloadVsOverride()`

One variable, `Parent x = new Child()`, is used for both overload and override behavior:

```text
select(x)
→ compile-time type Parent
→ select(Parent)

x.call()
→ runtime object Child
→ Child.call()
```

That contrast is the most important takeaway from this chapter.
