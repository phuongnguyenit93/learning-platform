Methods such as `append` synchronize on the buffer object, preventing some races at individual method-call boundaries when several threads share the buffer.

The trade-off is synchronization overhead and possible contention.

For thread-confined/local construction, `StringBuilder` is normally the simpler choice.

### WHAT does synchronization guarantee?

Conceptually:

```text
thread A calls append(...)
        │
        └── synchronized on the StringBuffer instance

thread B calls append(...)
        │
        └── coordinates through the same monitor for that call
```

This differs from `StringBuilder`, whose API does not provide the same internal synchronization.

But synchronized methods do not make an arbitrary multi-step workflow atomic.
