`null` is compatible with reference types. If unrelated overloads are equally applicable:

```java
void print(String x) { }
void print(Integer x) { }

print(null); // ambiguous
```

the compiler cannot choose one candidate. An explicit cast can disambiguate when that is the actual intent.

`null` is not always ambiguous. If one overload parameter type is more specific than another, that overload can still win:

```java
void print(Object x) { }
void print(String x) { }
print(null); // String overload
```
