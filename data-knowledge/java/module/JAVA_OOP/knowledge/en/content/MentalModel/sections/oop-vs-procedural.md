### WHAT — what is being decomposed differently?

Procedural decomposition usually organizes code around **operations and data flow**. OOP decomposition usually organizes code around **objects and responsibilities**.

| Design question | Procedural | OOP |
| --- | --- | --- |
| Primary unit | Function / procedure | Object / responsibility |
| State | Often passed through operations | Often owned by an object |
| Change tends to localize by | Flow / operation | Responsibility / type |
| Natural fit | Pipelines, linear transforms, algorithms | Stateful domains, collaborators, behavior varying by type |

### WHY — OOP is not universally better

A short data transformation or pure algorithm may be clearer as a function. Forcing every concept into an object hierarchy can add ceremony without adding clarity.

Conversely, when a domain has long-lived state, invariants, multiple implementations, and collaboration that evolves over time, object boundaries can make reasoning easier.

Java supports both styles. Modern Java code often mixes them intentionally: objects own responsibilities while functions or lambdas handle local transformations.

### EVIDENCE — what should you observe while learning this module?

Do not judge OOP by the number of classes. Observe whether a change becomes more localized. Adding a pricing strategy without changing `Checkout` is much stronger evidence than merely proving that Java has an `interface` keyword.

### PRACTICE — the roadmap forward

Keep one question throughout the module:

> “Which problem in the current mental model is the next concept solving?”

The next chapter starts with the first problem: **once an object owns state, how do we prevent callers from breaking it?**
