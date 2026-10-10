A static method reference has the form `TypeName::staticMethod`. The parameters of the target functional interface are passed to the referenced static method in the same order.

```java
Function<String, Integer> parse = Integer::parseInt;
BinaryOperator<Integer> max = Math::max;
```

For `parse`, `Function.apply(String)` supplies the argument to `Integer.parseInt(String)`. For `max`, the two `BinaryOperator` arguments become the two arguments of `Math.max`.

The target type still matters when a static method is overloaded. The text before and after `::` is not enough by itself to choose one overload.
