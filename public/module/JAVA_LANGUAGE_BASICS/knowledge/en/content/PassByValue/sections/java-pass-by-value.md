Each parameter receives a copy of the argument value.

For a primitive, changing the parameter does not change the caller's variable.

For an object reference, the parameter receives another reference value pointing to the same object.

### Mental model: the callee never receives the caller's variable slot

```text
caller variable                    parameter variable
┌──────────────┐     copy value    ┌──────────────┐
│ reference R  │ ───────────────→  │ reference R  │
└──────────────┘                   └──────────────┘
        │                                  │
        └──────────────→ User object ←─────┘
```

The parameter is a new variable owned by the call frame. Primitive arguments copy primitive values; reference arguments copy reference values. Java therefore remains consistently pass-by-value.
