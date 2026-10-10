`MessageFormat` uses `'` as a quoting character in its pattern language. This is a frequent source of bugs because natural-language translations can contain apostrophes.

To produce a literal apostrophe inside the pattern, doubled apostrophes are commonly required:

```java
MessageFormat format = new MessageFormat(
        "User ''{0}'' has {1,number} orders",
        Locale.US
);
```

Treat translated values used as `MessageFormat` input as **patterns**, not as opaque strings:

```text
translated resource
        ↓
MessageFormat pattern syntax
        ↓
placeholders + apostrophe quoting
        ↓
must be validated/tested with real arguments
```

If a message has no parameters, it does not need to be forced through `MessageFormat` merely for consistency.
