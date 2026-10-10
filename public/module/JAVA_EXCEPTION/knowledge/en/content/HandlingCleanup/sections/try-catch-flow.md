Example:

```java
try {
    load();
    process();
} catch (IOException ex) {
    recover(ex);
}
```

If `load()` succeeds:

```text
load
→ process
→ skip catch
→ continue after try/catch
```

If `load()` throws `IOException`:

```text
load
→ throw
→ process is skipped
→ find a compatible catch
→ recover
→ continue after try/catch if the handler completes normally
```

If the thrown exception does not match the handler, propagation continues.

### Catch does not automatically mean recovery

A common misunderstanding is:

```java
catch (Exception ex) {
    System.out.println("error");
}
```

Catching only means propagation was stopped there. It does **not** automatically restore a valid program state.

Catch where the current layer has meaningful work to do, for example:

- recover through a valid fallback;
- translate into the current abstraction;
- add useful context and rethrow;
- deliberately terminate the operation;
- at an outer boundary, record/map the failure.

If the layer has no useful action, propagation is often better than swallowing the failure.

### Broad catches need a clear boundary reason

`catch (Exception ex)` is not universally wrong. It may be appropriate at an application boundary that must turn application failures into one final outcome.

In middle layers, however, a broad catch can:

- capture failures the layer does not understand;
- hide programming bugs;
- destroy type-specific policy;
- make success/failure semantics ambiguous.
