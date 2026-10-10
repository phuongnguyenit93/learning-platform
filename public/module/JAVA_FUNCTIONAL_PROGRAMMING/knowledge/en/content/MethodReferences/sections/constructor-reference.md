A constructor reference has the form `TypeName::new`. It lets a functional interface describe object creation without writing a lambda whose only job is `new`.

```java
Supplier<List<String>> listFactory = ArrayList::new;
Function<String, StringBuilder> builderFactory = StringBuilder::new;

List<String> names = listFactory.get();
StringBuilder builder = builderFactory.apply("Java");
```

The target type determines which constructor shape is required. A zero-argument `Supplier` looks for a compatible zero-argument constructor, while a one-argument `Function` looks for a compatible one-argument constructor.

Generic type inference still applies. The reference does not bypass normal constructor accessibility or overload-resolution rules.

Arrays also support constructor references. In that form, the target functional interface supplies the requested array length:

```java
IntFunction<String[]> stringArray = String[]::new;
String[] values = stringArray.apply(3);
```

For a bound reference such as `receiver::method`, the receiver expression is evaluated when the method-reference expression itself is evaluated. If that expression produces `null`, creating the bound method reference throws `NullPointerException`; the null check is not postponed until the functional method is invoked.
