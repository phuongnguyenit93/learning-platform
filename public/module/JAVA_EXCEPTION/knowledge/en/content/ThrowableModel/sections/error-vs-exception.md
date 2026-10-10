`Error` usually represents serious JVM, linkage, environment, or assertion conditions such as `OutOfMemoryError` or `NoClassDefFoundError`.

`Exception` usually represents failures that an API or application may model, handle, translate, or propagate, such as `IOException`, `IllegalArgumentException`, or an application-specific exception.

### WHY THE DISTINCTION MATTERS

Java syntax still permits:

```java
try {
    run();
} catch (Throwable t) {
    ...
}
```

But `catch (Throwable)` is extremely broad and also catches `Error`. Ordinary application code can then accidentally turn a serious runtime condition into something treated like a routine business failure.

Useful mental model:

```text
Exception
→ application code may have a meaningful failure policy

Error
→ do not assume ordinary application code can safely recover
```

This is design guidance, not a claim that an `Error` can never be caught. Specialized boundaries may need observation or cleanup, but `catch (Throwable)` should not be a generic default handler.

### The hierarchy determines catch breadth

The type declared by a `catch` selects a **branch of the hierarchy** that the handler can receive:

```text
catch (Throwable)
→ very broad: receives both Error and Exception

catch (Exception)
→ receives Exception and its subclasses
→ does not receive Error

catch (IOException)
→ narrower: receives IOException and its subclasses
```

Choosing a catch type is therefore not name memorization; it is choosing the **failure range the current layer actually owns**. Catching too broadly can pull in failures the layer does not understand, while narrower types make handling policy clearer.

The propagation chapter later covers the exact selection rules when several catch handlers are present.
