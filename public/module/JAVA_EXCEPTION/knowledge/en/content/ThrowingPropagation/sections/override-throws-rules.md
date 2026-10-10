Suppose the parent contract is:

```java
class Parent {
    void load() throws IOException {
    }
}
```

An override may not broaden that checked contract:

```java
class Child extends Parent {
    @Override
    void load() throws Exception { // compile error
    }
}
```

### WHY?

Code may hold the object through a `Parent` reference:

```java
Parent value = new Child();
value.load();
```

The caller is compiled against `Parent`. If `Child` could introduce a broader checked failure, callers could encounter a checked exception the parent contract never required them to prepare for.

This is part of substitutability:

```text
a subtype may promise fewer/narrower checked failures
but may not require callers to handle broader checked failures
```

Unchecked exceptions are not restricted by the same catch-or-declare rule.
