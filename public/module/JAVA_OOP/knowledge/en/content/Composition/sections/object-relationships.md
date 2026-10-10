These terms describe relationships in an object model; they are **not four separate Java runtime features**.

| Relationship | Typical design meaning | Common Java representation |
| --- | --- | --- |
| Dependency | temporary use for an operation | parameter/local/short-lived reference |
| Association | a longer-lived collaboration | field/reference |
| Aggregation | weak/shared ownership | field/reference + lifecycle convention |
| Composition | strong ownership, part lifecycle tied to whole | field/reference + construction/API rules |

Java sees references; ownership meaning mostly comes from the design contract.

### PITFALL — a `final` reference does not automatically mean composition

For example:

```java
class Team {
    private final Player captain;

    Team(Player captain) {
        this.captain = captain;
    }
}
```

`final` only means the `captain` field cannot be reassigned to a different reference after initialization. It does **not prove** that:

- `Team` is the only owner of `Player`;
- `Player` cannot be shared elsewhere;
- `Player` must die with `Team`;
- the relationship is composition in the modeling sense.

Ownership is a **design semantic**, not something Java infers from one keyword.

### WHY — do not infer UML semantics from syntax alone

Two classes both having fields is not enough to decide aggregation vs composition. Look at who creates the part, who retains it, whether it can be shared, and how lifecycle is managed.
