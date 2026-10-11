A method reference has no useful standalone function type. Java interprets it against a target functional interface and checks whether the referenced invocation can satisfy that interface's function type.

The important pieces are:

- the number and order of target parameters;
- receiver mapping for instance methods;
- parameter conversions allowed by Java method invocation;
- compatibility of the referenced result with the target result;
- overload resolution when several members share the same name.

```java
Function<String, Integer> decimal = Integer::parseInt;
ToIntFunction<String> decimalPrimitive = Integer::parseInt;
```

Both references point to the same operation, but the target contracts differ: one produces `Integer`, while the other produces primitive `int`. Normal boxing/unboxing and target typing determine whether the assignment is valid.
