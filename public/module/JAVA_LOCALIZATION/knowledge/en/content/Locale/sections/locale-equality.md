`Locale` is an immutable value object. Equality reflects the locale components that make up its identity.

```java
Locale a = Locale.forLanguageTag("vi-VN");
Locale b = Locale.of("vi", "VN");

System.out.println(a.equals(b)); // true
```

But “can use the same translation after fallback” is not the same thing as equality:

```java
Locale en = Locale.forLanguageTag("en");
Locale enUS = Locale.forLanguageTag("en-US");

System.out.println(en.equals(enUS)); // false
```

`en-US` carries a region and `en` does not. Resource fallback may eventually select a common bundle, but that is lookup behavior, not locale identity.

If a cache wants to group only by language, use `locale.getLanguage()` deliberately rather than assuming whole-locale equality has that meaning.

The next chapter moves from the in-memory Java object to the **language tag**, the textual form used across HTTP, configuration, databases, and other systems.
