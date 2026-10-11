Functional style is strongest when a problem can be expressed as small behavior values, transformations, conditions, or policies that compose cleanly.

Imperative style can be clearer when the main story is a sequence of state changes: retry counters, resource lifecycles, state machines, complex early exits, or workflows where each step depends on mutations from the previous step.

```java
for (Task task : tasks) {
    if (!task.ready()) {
        continue;
    }
    execute(task);
    completed++;
}
```

There is no requirement to rewrite such code into a chain of lambdas. Choose the form that exposes the real control flow and invariants most directly.
