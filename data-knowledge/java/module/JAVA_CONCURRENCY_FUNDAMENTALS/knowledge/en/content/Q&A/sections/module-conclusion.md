The ultimate goal is not to memorize as many classes as possible.

The mental model to keep is:

```text
Correctness
→ JMM + synchronization

Progress
→ coordination + liveness design

Resource control
→ executor + queue + rejection + lifecycle

Result composition
→ Future / CompletableFuture

Context
→ explicit propagation + cleanup

Scalability
→ choose the right execution model, including Virtual Thread
```

Once you've properly categorized the issue, it's much easier to choose an API.
