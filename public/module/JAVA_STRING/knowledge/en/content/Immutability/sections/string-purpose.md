`String` is the `java.lang` class used to represent **a text value** in a Java program. It is an object, not a primitive. A String can carry content such as a user name, message, path, text identifier, request/response content, or configuration text. At the Java API level we work with a sequence of text; the distinctions among UTF-16 code units, Unicode code points, and user-perceived characters are developed in later chapters.

Text needs a dedicated type because its operations and boundaries differ from numeric data or domain objects: applications need content comparison, searching, extraction, transformation, Unicode handling, conversion between text and bytes, and reliable transport across boundaries. That is why `String` appears frequently in input/output, user interfaces, textual names and identifiers, API payloads and headers, logs, configuration, persistence, and network/protocol boundaries.

This does not mean every piece of data should be converted to String. Money, time, state, and domain identifiers usually deserve types that preserve their meaning inside business logic; `String` is appropriate when the value is genuinely text or when a boundary requires a textual representation.

`String` is Java's central text type, but text is more complicated than “an array of chars”. We need to distinguish the String value inside the JVM, Unicode's model of characters, and the encoded bytes used at external boundaries.

**Immutability** is the foundation connecting these topics. Once a `String` object is created, its content does not change in place. A **String literal** is a String written directly in source code, such as `"java"`; immutable literal values can participate in String-pool sharing. Immutability also makes hashing and API boundaries much easier to reason about.

The module therefore starts by defining String and its role, then explains immutability, pooling, equality, everyday operations, construction costs, mutable builders, and explicit canonical reuse. It then establishes the Unicode text model before crossing the text/byte boundary through Charset, and finishes with regular expressions plus source-level multiline representation.

Roadmap:

```text
What is String, and why does Java need a dedicated text abstraction?
String Purpose
        ↓
Can a String value change in place?
Immutability and Value Semantics
        ↓
Why can equal literals sometimes share identity?
String Pool → Reference Identity → Content Equality
        ↓
Which APIs inspect, search, extract, and transform String values?
Core String Operations
        ↓
What happens when Strings are combined repeatedly?
Concatenation → StringBuilder → StringBuffer → intern()
        ↓
Why is char not always one user-visible character?
Unicode / Code Point / Grapheme
        ↓
How does Unicode text become bytes and bytes become text?
Encoding / Charset
        ↓
How do we describe text patterns?
Regex
        ↓
How do we represent multiline String literals and connect the whole model?
Text Blocks → Synthesis
```
