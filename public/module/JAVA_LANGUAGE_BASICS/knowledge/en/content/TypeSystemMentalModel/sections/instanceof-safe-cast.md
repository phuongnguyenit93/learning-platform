Pattern matching can combine a runtime type test and binding:

```java
if (animal instanceof Dog dog) {
    dog.bark();
}
```

If code repeatedly branches with `instanceof` only to choose subtype behavior, reconsider the abstraction/polymorphism design.

`instanceof` with `null` is always `false`. Pattern variables exist only in the region where the compiler knows the test succeeded.

### Pattern matching is more than removing an explicit cast

The more important idea is that the compiler connects the **type test, binding, and control flow**:

```java
if (animal instanceof Dog dog && dog.isReady()) {
    dog.bark();
}
```

`dog` is available on the right side of `&&` because that operand runs only after the match succeeds.

A guard clause can also extend the useful flow scope after the failure path exits:

```java
if (!(value instanceof String text)) {
    return;
}

System.out.println(text.length());
```

At the final line, the compiler knows execution can continue only after the pattern matched.

A pattern variable is not available where the compiler cannot guarantee that the match happened. Keep this mental model:

```text
runtime type test succeeds
        ↓
compiler permits a typed binding
        ↓
binding exists only where success is guaranteed
```

### Java 21: switch can match type patterns

Once static type, runtime type, and pattern-variable flow scope are established, Java 21 pattern matching in `switch` fits naturally into the same model. A reference selector may be matched using type patterns:

```java
static String describe(Object value) {
    return switch (value) {
        case Integer i -> "integer: " + i;
        case String s -> "string: " + s;
        case null -> "null";
        default -> "other";
    };
}
```

Mental model:

```text
switch selector
→ constant/enum/String-style matching when appropriate
→ type-pattern matching for reference values
→ bind a pattern variable when a case matches
→ optionally handle null explicitly with case null
```

`case Integer i` both tests the runtime type and binds `i` with static type `Integer` inside that case. This is the same family of mechanism as `instanceof Integer i`, applied to a switch decision table.

If a reference selector may be `null`, treat that as part of the contract. `case null` handles it explicitly; without an applicable null case, switching on null can fail rather than simply falling through to `default`.

Do not mechanically replace every `if/else instanceof` chain with a pattern `switch`. Use it when several branches classify the same selector and the switch form makes the decision model clearer.
