Once a MethodHandle identifies the correct operation, the powerful part of `java.lang.invoke` is creating **new handles** through adaptation and composition instead of writing a wrapper method for every shape.

```text
(Greeter,String)String
        ↓ bind receiver
(String)String
        ↓ filter argument
(Object)String
        ↓ filter return
(Object)Object
```

Each step produces a new handle with a new `MethodType`, while the result remains directly executable.

- **adaptation** changes how callers present arguments/results to a target;
- **composition** combines handles into a larger executable operation.

Adapters are not automatically free. Conversions, boxing, casts, and deep pipelines can have costs. Choose them for a sound runtime design first, then benchmark when performance actually matters.
