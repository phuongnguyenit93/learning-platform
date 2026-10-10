Workers in a pool can live for a long time and run many tasks.

If the task does:

```java
context.set(value);
```

But without a cleanup, the following task running on the same worker may encounter the stale context or hold the reference for longer than necessary.

Safety Pattern:

```java
context.set(value);
try {
    task.run();
} finally {
    context.remove();
}
```

Here's Why Context Propagation Wrapper/Spring `TaskDecorator` Always need the Restore + Cleanup step.
