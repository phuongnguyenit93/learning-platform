A switch expression produces a value:

```java
String label = switch (status) {
    case NEW -> "new";
    case DONE -> "done";
    default -> "other";
};
```

For a multi-statement case block, `yield` provides the switch-expression result.

Arrow-style cases also avoid accidental fall-through from classic colon-style switch statements.

Switch expressions must produce a value on the required paths. `yield` returns a value from a switch-expression block; it does not return from the enclosing method.

### Java 21 extends `switch` further

Java 21 also allows `switch` to classify reference values with patterns. At this milestone, it is enough to recognize that capability; **type patterns, runtime types, and pattern-variable flow scope** are explained later after the learner has the module's type-system mental model.
