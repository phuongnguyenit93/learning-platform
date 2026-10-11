Choose retention from the consumer's latest required observation point:

| Consumer need | Typical retention |
| --- | --- |
| Compiler check or source annotation processor only | `SOURCE` |
| Class-file/bytecode tooling after compilation | `CLASS` |
| Runtime framework or reflective library | `RUNTIME` |

Do not select `RUNTIME` merely because it feels more capable. Runtime retention enlarges the metadata that survives into deployed class files and exposes it to runtime consumers even when no runtime use exists.

For `@Audit`, a runtime interceptor that inspects methods requires `RUNTIME`. A compile-time generator that turns the same metadata into generated code could work with `SOURCE` or `CLASS` depending on its pipeline.

### PRACTICE — ask when, not where

Retention answers **when the metadata must still exist**. It does not answer where the annotation may be written. The next chapter handles that separate question through `@Target` and `ElementType`.
