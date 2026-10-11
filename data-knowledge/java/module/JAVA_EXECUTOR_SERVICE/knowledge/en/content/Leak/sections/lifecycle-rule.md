Each resource concurrency needs to be able to answer:

```text
Who created it?
Who stopped it?
When to stop?
What if the shutdown timeout happens?
Does Task work with interruption?
```

If you can't answer the owner/lifecycle, resource leaks are very easy to appear.
