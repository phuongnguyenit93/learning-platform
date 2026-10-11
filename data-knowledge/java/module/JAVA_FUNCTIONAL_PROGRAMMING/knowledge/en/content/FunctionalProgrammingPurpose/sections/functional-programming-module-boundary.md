This Java Core module owns the stable Java mechanics needed to work with behavior as typed values:

- functional-interface and SAM rules;
- lambda expressions and target typing;
- variable capture and lambda scope;
- standard interfaces in `java.util.function`;
- method and constructor references;
- Java-level behavior composition;
- `Optional` as a Java API for explicit absence;
- practical issues such as side effects, checked exceptions, readability, and choosing an appropriate style.

Two neighboring areas are intentionally boundaries:

- language-neutral functional-programming theory is owned by the Functional Programming paradigm module;
- Stream pipeline semantics, laziness, reduction, collectors, ordering, and parallel processing are owned by the Stream API module.

This separation keeps the mental model clear: first learn how Java represents and types behavior, then reuse those mechanics in APIs that consume behavior.
