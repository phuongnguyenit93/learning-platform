An override may:

```text
keep the same checked exception
→ throws IOException

narrow it to a subtype
→ throws FileNotFoundException

remove it entirely
→ no throws clause
```

Valid example:

```java
class Child extends Parent {
    @Override
    void load() throws FileNotFoundException {
    }
}
```

or:

```java
class InMemoryChild extends Parent {
    @Override
    void load() {
    }
}
```

The child provides an equal-or-easier checked failure contract.

### REMEMBER

```text
throw
→ runtime action

throws
→ declaration contract

override
→ may not broaden the checked contract

precise rethrow
→ catching broadly does not necessarily widen throws
```

The next chapter examines the point where propagation is handled: how `try`, `catch`, and `finally` interact across different exit paths.
