The compiler removes a defined amount of indentation that belongs to source formatting, allowing a text block to sit naturally inside indented Java code.

Mental model:

```text
source indentation for readable Java code
        ↓ compiler determines incidental indentation
strip incidental part
        ↓
String content
```

The closing delimiter position can influence what indentation is considered incidental, so place content and delimiter consistently.

Whitespace inside the resulting text still matters. When exact output matters, inspect/test the actual String rather than relying only on visual indentation.

Trailing whitespace is also treated specially so invisible editor formatting does not silently become data. If trailing space is intentional, use an explicit mechanism such as `\s`.

### Trailing newline and the closing delimiter

These shapes can differ in whether the result ends with a newline:

```java
String withNewline = """
        hello
        """;

String withoutNewline = """
        hello""";
```

When exact output matters, assert `length()` or inspect an escaped representation rather than trusting visual source layout.

### String.indent and stripIndent

Multiline text does not only come from text-block literals. `String` also provides runtime indentation operations:

```java
String text = "alpha\nbeta\n";

String indented = text.indent(4);
String stripped = indented.stripIndent();
```

Mental model:

```text
text-block incidental indentation
→ compiler processing while creating the literal from source

String.indent / stripIndent
→ runtime String operations
```

The two ideas are related by purpose, but they are not the same mechanism.
