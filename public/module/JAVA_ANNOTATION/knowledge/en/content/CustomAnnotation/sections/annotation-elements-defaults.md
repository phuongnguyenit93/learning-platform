Elements may require values or provide defaults:

```java
public @interface Audit {
    String action();
    int level() default 1;
}
```

Now callers must provide `action`, while `level` is optional:

```java
@Audit(action = "PAYMENT")
void pay() {
}

@Audit(
        action = "REFUND",
        level = 2
)
void refund() {
}
```

Array-valued elements can also provide defaults without changing the running `@Audit` schema:

```java
public @interface Labels {
    String[] value() default {};
}
```

Defaults are part of the annotation type declaration. They are not fields stored independently in every annotation use.

### DESIGN — defaults carry semantics

A default should mean something stable. For example:

```text
level = 1
→ the absence of an explicit value has a clear interpretation

owner = ""
→ may be ambiguous unless empty string is an intentional sentinel
```

Changing a default can change how existing annotation uses are interpreted even when those source files do not change. Treat defaults as part of the metadata contract.
