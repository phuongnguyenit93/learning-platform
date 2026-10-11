The base bundle has no locale suffix:

```text
Messages.properties
```

It can serve as the final general resource set in the bundle hierarchy. With the default control, however, do not assume that finding the base candidate means it is always returned before a fallback-locale branch is considered; final resolution depends on the complete `ResourceBundle.Control` algorithm.

Two common strategies are:

```text
Strategy A
base bundle = the product's practical default language, such as English

Strategy B
base bundle = a minimal safe fallback set
localized bundles contain full language-specific content
```

Neither strategy works well if the team has not agreed on it. For example, an English base bundle can quietly leak English into another locale when a translation key is missing.

Parent lookup also means a locale-specific bundle does not technically need to duplicate every key that exists in its resolved parent chain. A product may still require 100% per-locale key completeness and enforce that with tests.
