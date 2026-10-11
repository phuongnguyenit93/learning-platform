The most obvious violation is adding a second unrelated abstract method:

```java
@FunctionalInterface
interface BrokenRule {
    boolean test(String value);
    String describe(); // compile-time error: no longer functional
}
```

Other failures can come from inheritance when inherited abstract declarations cannot be represented by one valid overriding method, for example incompatible return types.

When such a failure appears, fix the interface design instead of removing `@FunctionalInterface` merely to silence the compiler if callers are expected to use lambdas. Common options are:

- keep one abstract behavior and move supporting operations to `default` or `static` methods when that design is coherent;
- split unrelated responsibilities into separate interfaces;
- use an ordinary non-functional interface when the abstraction genuinely requires multiple abstract operations.

The goal is not "make every interface functional." The goal is to use a functional interface only when one behavior contract accurately represents the abstraction.
