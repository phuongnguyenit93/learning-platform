Think of the tooling levels like this:

| Level | Benefit | Cost |
| --- | --- | --- |
| ASM-like low-level | precise bytecode control, little abstraction | requires strong JVM/class-file expertise |
| Byte Buddy-like high-level | matcher/advice model, easier maintenance | requires understanding generated helpers/abstractions |
| Standard Class-File API | platform API on newer JDKs | tied to JDK baseline/version boundary |

Do not choose by line count alone.

A simple “instrument every @Timed method” agent can be natural with a high-level matcher. A compiler-like tool rewriting unusual instruction patterns may fit a lower-level API better.

Use the **highest abstraction level that still gives precise control over the use case's constraints**.
