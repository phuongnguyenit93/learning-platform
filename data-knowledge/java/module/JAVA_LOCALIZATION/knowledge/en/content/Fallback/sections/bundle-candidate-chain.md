Suppose the base name is `Messages` and the requested locale is `en-US`.

Available bundles might include:

```text
Messages_en_US.properties
Messages_en.properties
Messages.properties
```

A beginner mental model for one target-locale candidate list is:

```text
start with the most specific requested locale
        ↓
try a more general candidate when necessary
        ↓
Locale.ROOT represents the base bundle candidate
```

Candidate locales can be inspected through `ResourceBundle.Control`:

```java
ResourceBundle.Control control = ResourceBundle.Control.getControl(
        ResourceBundle.Control.FORMAT_DEFAULT
);

List<Locale> candidates = control.getCandidateLocales(
        "Messages",
        Locale.forLanguageTag("en-US")
);
```

Locales containing script or variant subtags can have a richer chain than the simple `en-US` example. Let the JDK's resource-bundle algorithm own this behavior instead of implementing filename fallback manually.

Candidate generation and fallback-locale selection are separate steps. `getCandidateLocales(...)` creates candidates for one locale being considered. If the active `ResourceBundle.Control` supplies another fallback locale (the default control may use the JVM default locale), lookup can create another candidate list for that locale. Do not model the complete algorithm as one hard-coded filename sequence.
