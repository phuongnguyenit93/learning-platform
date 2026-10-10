Two familiar consumers:

- lambdas can be linked through `LambdaMetafactory`;
- string concatenation can use `StringConcatFactory`.

```java
Function<String, String> upper =
        value -> value.toUpperCase();
```

Do not conclude that “a lambda is invokedynamic.” Lambda is a **language feature**; invokedynamic is one runtime/linkage mechanism the compiler and JDK can use to implement that feature.

Likewise:

```java
String result = "Hello " + name;
```

does not mean business code is deliberately programming against Dynamic Runtime APIs.

Keeping consumer and mechanism separate prevents this chapter from becoming a history of every feature implemented with invokedynamic.
