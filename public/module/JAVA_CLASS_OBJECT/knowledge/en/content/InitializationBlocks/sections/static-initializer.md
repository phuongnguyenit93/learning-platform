```java
static {
    ...
}
```

runs when the class is initialized, not once per object.

It can support static setup that is awkward as a single expression, but complex logic or I/O in static initialization makes startup and failure handling harder to control.
