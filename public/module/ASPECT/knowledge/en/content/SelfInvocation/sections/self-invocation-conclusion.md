When AOP does not run, the first question should be:

```text
did this invocation actually pass through the proxy?
```

It is usually better to refactor the boundary between beans than to work around the proxy model with hidden self-references.
