Collectors differ mainly in heap organization and in how collection work is divided between application and GC threads.

Useful dimensions include:

- **serial vs parallel** collection work;
- **stop-the-world vs concurrent** phases;
- **generational vs non-generational** organization;
- **region-based** heap organization;
- **compacting vs non-compacting** strategies.

Java 21 provides collectors with very different goals, and ZGC can even operate in generational or non-generational modes. That is a concrete reminder that there is no single algorithm called “Java GC.”
