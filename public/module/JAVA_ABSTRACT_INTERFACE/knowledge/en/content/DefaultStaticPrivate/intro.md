# Default, Static, and Private Interface Methods

Early Java interfaces were mostly treated as collections of abstract methods. Modern interfaces can also contain several kinds of implemented methods, but **each kind serves a different role**.

```text
default
→ inheritable default instance behavior
→ supports compatible contract evolution when a meaningful default exists

static
→ operation owned by the interface type itself
→ does not become an inherited instance method on implementing classes

private / private static
→ internal helper behavior reused by methods inside the interface
→ does not expand the public contract
```
