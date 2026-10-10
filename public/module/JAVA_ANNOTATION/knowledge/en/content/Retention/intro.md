# Retention and Annotation Lifetime

An annotation can be useful during source compilation, remain in the generated class file, or stay available to runtime reflection. Retention policy makes that lifetime explicit.

This chapter isolates the **lifetime** question. The examples intentionally omit `@Target`; the next chapter adds the separate rule for where an annotation may legally appear.

```text
source code
    ↓ compile
class file
    ↓ load
runtime Class model

SOURCE  → source-processing lifetime
CLASS   → class-file lifetime
RUNTIME → class-file + runtime reflection lifetime
```
