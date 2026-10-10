```java
String json = """
    {
      "name": "Java"
    }
    """;
```

The result is still an ordinary `java.lang.String`.

Text blocks are useful for JSON, SQL, HTML, and other multiline source literals because they reduce escape and concatenation noise.

### A text block is source syntax, not a new runtime type

Two source forms can produce the same String value:

```java
String a = "hello\nworld\n";

String b = """
        hello
        world
        """;

a.equals(b); // true
```

All normal String rules for immutability, equality, encoding, and Unicode still apply.

### Opening delimiter

After the opening `"""`, Java text-block syntax requires a line terminator. Content begins on following lines, giving multiline source a clear structure.
