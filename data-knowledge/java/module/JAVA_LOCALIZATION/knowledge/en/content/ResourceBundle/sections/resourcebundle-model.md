In plain language, `ResourceBundle` is a **key + Locale resource lookup mechanism**.

It does not translate English into Vietnamese automatically. Developers or translators **prepare localized resources in advance**, and `ResourceBundle` selects the appropriate one at runtime.

A bundle system usually has five important pieces:

```text
base name
→ name of the resource family, for example Messages

Locale
→ locale being served, for example vi-VN

bundle family
→ Messages.properties, Messages_vi.properties, Messages_vi_VN.properties...

resource key
→ stable identifier such as order.created

resource value
→ actual content such as "Đơn hàng đã được tạo"
```

The role of `ResourceBundle` is to connect these pieces and apply candidate/fallback rules to find the appropriate value.

Suppose the UI needs the semantic message `order.created`.

Without a bundle, code may become:

```java
String message;
if (locale.getLanguage().equals("vi")) {
    message = "Đơn hàng đã được tạo";
} else {
    message = "Order created";
}
```

`ResourceBundle` changes the model:

```text
code owns a stable key
        ↓
order.created
        ↓
ResourceBundle + Locale
        ↓
matching resource
        ↓
localized text
```

For example:

```text
Messages.properties
Messages_en.properties
Messages_en_US.properties
Messages_vi.properties
Messages_vi_VN.properties
```

```properties
# Messages_en.properties
order.created=Order created

# Messages_vi.properties
order.created=Đơn hàng đã được tạo
```

Lookup code stays language-neutral:

```java
Locale locale = Locale.forLanguageTag("vi-VN");
ResourceBundle bundle = ResourceBundle.getBundle("Messages", locale);

String message = bundle.getString("order.created");
```

`Messages` is the **base name**, `order.created` is the stable **resource key**, and the locale participates in selecting the best bundle.
