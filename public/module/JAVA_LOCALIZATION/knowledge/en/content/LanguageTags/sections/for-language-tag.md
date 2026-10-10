Convert text to a `Locale`:

```java
Locale viVN = Locale.forLanguageTag("vi-VN");
```

Convert back to the language-tag form:

```java
String tag = viVN.toLanguageTag();
System.out.println(tag); // vi-VN
```

This is preferable to inventing a transport format such as:

```java
locale.getLanguage() + "_" + locale.getCountry()
```

BCP 47 uses `-`, while traditional resource-bundle suffixes commonly use `_`:

```text
language tag             → vi-VN
ResourceBundle file name → Messages_vi_VN.properties
```

Do not treat these conventions as interchangeable.
