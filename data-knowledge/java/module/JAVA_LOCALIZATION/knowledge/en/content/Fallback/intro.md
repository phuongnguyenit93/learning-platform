# Resource Fallback

A localization system rarely needs a completely independent resource file for every possible language-script-region combination. `ResourceBundle` therefore supports fallback: when the best resource for the requested Locale cannot be resolved, lookup can continue through candidate locales and, when the active policy allows it, through a fallback-Locale branch such as the JVM default Locale.

Fallback is useful, but “the application still displayed something” does not necessarily mean localization is complete or correct.

In plain language, **fallback is the strategy for continuing resource lookup when the preferred Locale path does not resolve an acceptable resource**. Trying less-specific candidates is one part of that strategy; switching to a fallback Locale can be another.

It exists because, without fallback, an application would need a complete independent file for every precise locale or would fail whenever a small locale-specific variant was missing. Fallback enables reuse, but developers must understand where the final value actually came from.

The main pieces in the fallback process are:

```text
requested Locale
→ locale requested by the user/context

candidate locales
→ progressively less-specific lookup candidates

default Locale fallback
→ additional fallback path in the default ResourceBundle policy

base bundle
→ resource bundle with no locale suffix

missing-resource behavior
→ what happens when no acceptable bundle/key can be found
```
