The Java-specific mental model can now be read as one connected flow:

```text
varying behavior
    -> functional-interface contract
    -> lambda or method/constructor reference
    -> target typing checks parameter/result compatibility
    -> optional capture of surrounding values
    -> pass, return, or compose the behavior
    -> invoke it through the functional-interface method
    -> keep state, effects, exceptions, and readability explicit
```

Standard interfaces in `java.util.function` provide reusable contracts; custom functional interfaces are appropriate when domain meaning or exception rules require a different contract. `Optional` applies the same style to explicit absence at selected API boundaries. Stream APIs reuse these mechanisms by accepting functional-interface values, while their own processing semantics live in the Stream API module.

Use functional Java where behavior parameterization and composition reduce duplication and expose intent. Use ordinary imperative or object-oriented structure where stateful workflow, richer object responsibilities, or debugging clarity make them a better fit. The goal is not the maximum number of lambdas; it is code whose behavior and constraints remain easy to understand.
