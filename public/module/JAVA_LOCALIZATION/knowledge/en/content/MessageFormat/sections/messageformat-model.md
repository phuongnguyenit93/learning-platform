`MessageFormat` is a **formatter for a parameterized message template**. It takes a pattern, argument values, and a `Locale`, then produces the final message.

Its main pieces are:

```text
pattern
→ "Order {0} was created for {1}."

placeholder / argument index
→ {0}, {1}, ...

argument value
→ 1001, "An", ...

optional format type/style
→ number, date, choice...

Locale
→ influences locale-sensitive sub-formats
```

Its role is **not translation**. `ResourceBundle` typically supplies the already-translated message pattern; `MessageFormat` inserts the dynamic values into that pattern correctly.

A basic pattern uses numeric argument indexes:

```text
Order {0} was created for {1}.
```

```java
MessageFormat format = new MessageFormat(
        "Order {0} was created for {1}.",
        Locale.US
);

String text = format.format(new Object[] {1001L, "An"});
```

Bundles can keep the same semantic key while changing sentence structure:

```properties
# English
order.created=Order {0} was created for {1}.

# Vietnamese
order.created=Đơn hàng {0} của {1} đã được tạo.
```

Application code supplies the arguments, while the translator owns the full sentence:

```java
String pattern = bundle.getString("order.created");
MessageFormat formatter = new MessageFormat(pattern, locale);
String message = formatter.format(new Object[] {order.id(), customerName});
```

This is safer than fragment concatenation because languages are free to place arguments differently.
