`String.valueOf(...)` is a common entry point for representing primitive or object values as text:

```java
String count = String.valueOf(42);
String active = String.valueOf(true);
```

Null behavior is worth knowing:

```java
String.valueOf((Object) null); // "null"
```

while:

```java
Object value = null;
// value.toString(); // NullPointerException
```

For structured output, Java also provides formatting:

```java
String message = "User %s has %d points".formatted("Ada", 42);
```

Formatting does not change String immutability; it produces another String result.

If formatting depends on language, numbers, dates, or regional presentation rules, cross into the `localization` module rather than assuming one format is correct for every locale.

The mental model to keep from this chapter is:

```text
core String APIs
→ inspect text
→ search for content/positions
→ extract with explicit boundaries
→ create transformed values
→ split/join multiple pieces
→ convert/format output text

none of these mutate the original String object
```

The next chapter focuses on one especially important construction operation: **concatenation**, where immutability directly affects how text is built across multiple steps.
