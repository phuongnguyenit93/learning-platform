A regular expression (**regex**) is a language for describing **text patterns**. It exists for questions that are no longer simple literal lookup, such as “does this input have the required shape?”, “find every substring following this rule”, or “extract components with a defined textual form”.

Regex is useful for validation, search, extraction, and replacement when the problem is genuinely **pattern-oriented**. If the task is only literal search, prefix/suffix testing, or literal replacement, direct `String` APIs are usually simpler and easier to read.

```text
find the literal text "users"
→ contains / indexOf

find every run of digits matching a rule
→ regex

parse a deeply structured grammar
→ consider a parser instead of forcing everything into regex
```
