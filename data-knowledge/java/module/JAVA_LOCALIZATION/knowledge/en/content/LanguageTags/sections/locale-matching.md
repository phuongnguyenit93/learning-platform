Real clients do not always say “use exactly `vi-VN`.” They may provide an ordered preference list, conceptually like:

```text
preference 1 → vi-VN
preference 2 → vi
preference 3 → en-US
```

The application then needs **locale matching**: compare the client's preferences with the locales the product actually supports and choose the best match.

Java Core provides `Locale.LanguageRange` together with `Locale.lookup(...)` and `Locale.filter(...)` for language-range matching:

```java
List<Locale.LanguageRange> ranges = Locale.LanguageRange.parse(
        "vi-VN,vi;q=0.9,en-US;q=0.8"
);

List<Locale> supported = List.of(
        Locale.forLanguageTag("vi-VN"),
        Locale.US
);

Locale matched = Locale.lookup(ranges, supported);
```

Keep these concepts separate:

```text
language tag
→ represents one locale/preference

language priority list
→ several preferences with priorities

locale matching
→ chooses the best supported locale
```

A web framework may perform this step for the application, but understanding it explains why the active locale is often **selected from preferences**, not simply copied from one user-provided tag.
