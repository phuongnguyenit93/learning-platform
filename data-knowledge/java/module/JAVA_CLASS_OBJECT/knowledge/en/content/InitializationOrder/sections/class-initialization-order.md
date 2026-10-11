When a class is initialized, its superclass is initialized first when required, then the class's static fields/blocks run in textual order.

```text
superclass static initialization
        ↓
subclass static fields/blocks in source order
```

Class loading/linking details belong in the classloader module; here the key point is when static state becomes initialized.
