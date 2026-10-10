A method reference is a compact way to describe behavior that already exists as a method or constructor. It plays the same role as a lambda in a target-typed context: Java still needs a functional-interface type to know the parameter and result contract.

Think of it as saying **"use this existing operation as the implementation of that functional contract"**. Writing the reference does not call the method immediately.

```java
Function<String, Integer> parse = Integer::parseInt;

int result = parse.apply("42");
```

The equivalent lambda is `text -> Integer.parseInt(text)`. The method reference is useful only when removing that wrapper makes the intent clearer.
