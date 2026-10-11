`MessageFormat` can apply sub-formats:

```text
Total: {0,number}
Created: {1,date,medium}
```

```java
MessageFormat format = new MessageFormat(
        "Total: {0,number} - Created: {1,date,medium}",
        Locale.US
);
```

These historical `java.text` sub-formats integrate with number/date types understood by that API family. Applications whose domain uses `java.time` often format date-time values explicitly with `DateTimeFormatter` and then pass the localized result into a message, keeping the conversion boundary clear.

`choice` formatting exists for numeric ranges, but real-world plural rules vary significantly across languages. Do not assume a simple English `1 item / many items` rule is linguistically universal.

The Java Core lesson is broader: **parameterized messages must let the translated pattern own grammar and must use the intended locale for any nested formatting**.
