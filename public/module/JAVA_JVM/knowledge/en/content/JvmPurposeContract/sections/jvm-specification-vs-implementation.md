The JVM Specification defines the contract a JVM must preserve: the class-file format, logical runtime data areas, instruction semantics, class lifecycle rules, frames, exception behavior, and other runtime rules.

A concrete implementation such as HotSpot must preserve that contract while remaining free to choose many internal details:

- physical object layout;
- garbage collector;
- JIT strategy;
- internal memory organization;
- code-cache organization;
- thresholds and heuristics;
- implementation-specific VM flags.

For example, the specification defines a heap used for objects and arrays and allows automatic storage management. It does **not** require a young/old-generation layout or require G1.

Likewise, the JVM is not inherently interpreted. A compliant implementation can interpret instructions, compile them to native code, or combine several execution strategies as long as the required semantics are preserved.

A useful rule is:

> Specification guarantees are the portable contract; HotSpot documentation describes implementation behavior.
