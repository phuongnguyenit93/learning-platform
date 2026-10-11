The three public, non-final `Object` methods—`equals`, `hashCode`, and `toString`—have an important proxy rule: invoking them on a proxy also dispatches to `InvocationHandler.invoke(...)`. The `Method` supplied to the handler has `Object.class` as its declaring class.

This makes the following handler logic dangerous:

```java
return method.invoke(proxy, args);
```

It invokes the method on the proxy again, which calls the handler again, causing recursive dispatch.

Blindly delegating those methods to the target can also produce surprising semantics. For example, `proxy.equals(proxy)` followed by `target.equals(proxy)` may return `false`, even when the proxy design intended identity semantics.

The handler should define these methods deliberately. The sample handler above uses identity semantics for `equals/hashCode` and a custom `toString`. Another framework can choose target-based semantics, but `equals` and `hashCode` must still remain contract-consistent.

Other final methods inherited from `Object`, such as `getClass()`, `wait()`, and `notify()`, do not become interception points in the same way as those three methods.
