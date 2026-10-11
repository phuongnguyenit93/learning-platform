The JVM is an abstract machine that executes programs represented in the **class-file format** instead of executing Java source code directly on a CPU. This extra execution layer lets compilers target a stable runtime contract while each JVM implementation maps that contract onto a concrete operating system, processor architecture, memory subsystem, and optimization strategy.

The problem the JVM solves is broader than “run Java on several operating systems.” Without a shared execution contract, each language/compiler toolchain would need far tighter coupling to every target machine and would have much less opportunity to share libraries, runtime services, garbage collectors, JIT compilers, and tooling.

A simpler alternative is compiling source directly to native machine code for each target. That can execute the program, but portability and distribution then move toward target-specific compiler outputs, and there is no shared **JVM contract** that every target is required to implement. A different native runtime can still provide its own garbage collector or tooling; it is simply a different runtime contract. The JVM inserts a common class-file execution layer between program representation and the host machine.

Keep this model throughout the module:

```text
source language
    ↓ compiler
class-file representation
    ↓ JVM implementation
runtime state + native machine execution
```

The JVM therefore exists both as a specification-level abstraction and as concrete implementations such as HotSpot. HotSpot is a JVM implementation; it is not the definition of “the JVM.”
