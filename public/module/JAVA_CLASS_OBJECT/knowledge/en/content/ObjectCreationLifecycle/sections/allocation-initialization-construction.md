A useful mental model is:

```text
allocate object memory
        ↓
fields receive default zero/null/false values
        ↓
superclass construction
        ↓
instance field initializers / initializer blocks
        ↓
current-class constructor body
        ↓
reference returned to caller if construction succeeds
```

Allocated memory is not the same thing as a valid constructed object. Invariants should be considered established only after the constructor chain completes successfully.
