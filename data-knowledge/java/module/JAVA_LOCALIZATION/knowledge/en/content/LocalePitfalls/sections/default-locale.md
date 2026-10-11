The JVM has a default locale:

```java
Locale current = Locale.getDefault();
```

That is convenient for local desktop-style applications, but in a multi-user backend it can become a **hidden environmental dependency**.

Java exposes two important categories:

```text
Locale.Category.DISPLAY
→ locale used when displaying locale/language/country names

Locale.Category.FORMAT
→ locale used by formatting operations
```

```java
Locale displayLocale = Locale.getDefault(Locale.Category.DISPLAY);
Locale formatLocale = Locale.getDefault(Locale.Category.FORMAT);
```

The default can be changed:

```java
Locale.setDefault(Locale.Category.FORMAT, Locale.US);
```

but this changes JVM-wide state and can affect unrelated code. Request-based servers are usually safer when they pass the user locale explicitly:

```java
NumberFormat format = NumberFormat.getNumberInstance(userLocale);
```

rather than silently relying on:

```java
NumberFormat format = NumberFormat.getNumberInstance();
```
