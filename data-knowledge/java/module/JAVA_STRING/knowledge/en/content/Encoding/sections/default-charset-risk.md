Since **JDK 18**, JEP 400 defines UTF-8 as the **Java default charset**. Under standard JDK behavior on Java 21, `Charset.defaultCharset()` is therefore UTF-8, and APIs whose contract says they use the default charset follow that choice; an explicitly selected compatibility/runtime configuration can deliberately change it. Do not generalize this to “every standard I/O stream uses `Charset.defaultCharset()`”: consoles and some standard streams have separate charset behavior.

The older mental model that “the Java default charset normally follows each OS/locale” is therefore no longer the Java 21 default.

For persistent or network data, make the charset part of the explicit protocol/format contract.

### Why still specify Charset explicitly?

Because encoding is a **data contract**, not merely an environment setting:

```text
producer
→ UTF-8 bytes
→ consumer

the contract should say UTF-8
```

Explicit `StandardCharsets.UTF_8` makes intent visible in code, avoids compatibility/configuration ambiguity, and makes protocol/file-format review easier.

Using the runtime default is fine when that is genuinely the API contract; durable and network formats usually benefit from an explicit charset.
