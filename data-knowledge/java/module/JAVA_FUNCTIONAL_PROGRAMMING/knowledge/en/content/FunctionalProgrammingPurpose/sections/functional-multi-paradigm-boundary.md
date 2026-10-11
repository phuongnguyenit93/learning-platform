Functional style in Java complements existing Java design rather than replacing it. A typical application may use:

- objects to model domain state and responsibilities;
- imperative statements for clear step-by-step workflows;
- functional interfaces and lambdas where behavior itself should vary;
- ordinary methods whenever naming and reuse make the code clearer.

For example, a service object can keep state and dependencies while accepting a `Predicate<Order>` to customize one decision. The presence of a lambda does not make the entire design "purely functional".

This module therefore teaches **Java's functional mechanisms**. Language-neutral theory such as referential transparency, pure functions, and immutability as paradigm-wide principles belongs to the dedicated Functional Programming paradigm module. Those ideas may be referenced here only when they help explain a Java-specific choice.
