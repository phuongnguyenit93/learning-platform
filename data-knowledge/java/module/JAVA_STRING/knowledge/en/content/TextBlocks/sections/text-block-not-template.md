Text blocks do not automatically interpolate variables:

```java
"""
Hello ${name}
"""
```

does not substitute `name` by itself.

Use formatting, concatenation, or an appropriate template mechanism when dynamic values must be inserted.

```java
String template = """
        Hello %s
        """;

String message = template.formatted(name);
```

A text block only improves source representation; it does not make `%s`, `${name}`, or arbitrary markers interpolate themselves without another API/mechanism.
