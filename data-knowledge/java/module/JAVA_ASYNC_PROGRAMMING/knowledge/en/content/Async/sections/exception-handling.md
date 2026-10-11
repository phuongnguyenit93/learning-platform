Three common APIs:

### Exceptionally

Only run when the previous stage fails and returns a fallback value.

### handle

Get Both `(result, exception)` and can always turn outcomes into new value.

### whenComplete

Observe success/failure but is usually not used to transform outcomes.

References:

```text
AsyncController#exceptionHandling()
GET /async/exception
```

Demo created failure `handle()` into a controlled result.
