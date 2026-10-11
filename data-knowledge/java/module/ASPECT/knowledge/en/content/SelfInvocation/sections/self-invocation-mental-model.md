Suppose the target contains:

```java
public void outer() {
    inner();
}

@TrackExecution("inner")
public void inner() {
}
```

External call:

```text
Controller
→ Proxy
→ inner()
```

Advice has a chance to run.

Self-invocation:

```text
Controller
→ Proxy
→ outer()
      ↓
   this.inner()
```

The call to `inner()` happens directly on the current target object and does not go back out through the proxy a second time.

Therefore **having an annotation does not guarantee that advice will run**.
