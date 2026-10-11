Resource bundles follow a naming convention based on the base name and locale components.

For:

```java
ResourceBundle.getBundle("Messages", Locale.forLanguageTag("en-US"));
```

a beginner-friendly model for **bundle resolution** is:

```text
requested Locale en-US
        ↓
generate candidate locales
        ↓
en-US → en → Locale.ROOT
        ↓
locate a bundle for those candidates
```

More complex locales containing script or variant components can produce a richer candidate list. Do not recreate that algorithm with string concatenation.

Once a bundle is resolved, **key lookup is a separate mechanism**: if a key is absent from the concrete bundle, lookup may continue through its established parent chain. Do not conflate “which bundle was resolved” with “which parent ultimately supplied a key.”

You can inspect the candidate locales through `ResourceBundle.Control`:

```java
ResourceBundle.Control control = ResourceBundle.Control.getControl(
        ResourceBundle.Control.FORMAT_DEFAULT
);

List<Locale> candidates = control.getCandidateLocales(
        "Messages",
        Locale.forLanguageTag("en-US")
);
```

Fallback is a **lookup rule**. It does not mean `Locale.forLanguageTag("en-US")` equals `Locale.forLanguageTag("en")`. Default-locale fallback policy is intentionally deferred to the final milestone.
