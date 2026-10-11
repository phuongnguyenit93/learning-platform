`Function` can combine two transformations into one reusable transformation. The two main methods differ only in execution direction.

```java
Function<String, String> trim = String::trim;
Function<String, Integer> length = String::length;

Function<String, Integer> trimThenLength = trim.andThen(length);
Function<String, Integer> sameFlow = length.compose(trim);

trimThenLength.apply(" Java "); // 4
```

For `f.andThen(g)`, data flows `f -> g`. For `g.compose(f)`, data also flows `f -> g`. Reading the types helps: the output of the first function must be compatible with the input of the next one.

Composition is valuable when the named pieces are meaningful on their own. Chaining many tiny functions can become harder to follow than one straightforward method.
