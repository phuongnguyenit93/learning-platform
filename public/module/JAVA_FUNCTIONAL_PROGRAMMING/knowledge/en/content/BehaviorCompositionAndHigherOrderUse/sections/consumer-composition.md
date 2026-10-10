`Consumer<T>` represents behavior whose contract does not return a result. `andThen` combines consumers in sequence.

```java
Consumer<String> log = value -> System.out.println("LOG: " + value);
Consumer<String> audit = value -> auditStore.add(value);

Consumer<String> logAndAudit = log.andThen(audit);
```

The first consumer runs before the second. If the first throws an exception, the second is not executed.

Because consumers commonly contain side effects, their order is observable. Composition should make that order clearer, not hide a fragile sequence of external actions.
