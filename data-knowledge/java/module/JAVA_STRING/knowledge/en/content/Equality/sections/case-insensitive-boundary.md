`equalsIgnoreCase` is useful for some simple comparisons, but case rules can be language- and locale-sensitive.

Importantly, `equalsIgnoreCase` itself **does not use a Locale**. It applies String's case-insensitive comparison rules, so it is not locale-aware collation and can be unsatisfactory for some languages.

```text
protocol/technical identifier
→ usually needs stable locale-neutral rules

human-language text
→ may need locale-aware comparison/collation
```

Do not assume lowercasing with the platform default locale is a universal comparison strategy. Locale-specific text behavior belongs in the localization module.

A common pitfall is:

```java
a.toLowerCase().equals(b.toLowerCase());
```

The no-argument conversion uses the process default Locale and creates intermediate Strings. If the domain needs locale-sensitive comparison, Locale must be an explicit part of the contract.

For technical identifiers or protocol tokens, follow the protocol/domain rule rather than treating default-locale lowercasing as universal normalization.

Next we build a mental model for everyday String operations: inspection, search, extraction, transformation, split/join, and formatting.
