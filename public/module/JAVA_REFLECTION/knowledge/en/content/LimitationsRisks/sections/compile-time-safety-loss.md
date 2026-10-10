A direct call gives the compiler a contract it can check:

```java
String result = service.pay(request);
```

If `pay` is renamed, its parameter type changes, or its return type changes, direct callers usually fail during compilation. With reflection:

```java
Method method = service.getClass().getMethod(methodName, PaymentRequest.class);
Object result = method.invoke(service, request);
```

`methodName` may come from configuration or an annotation. The compiler cannot prove that the string still names a valid member. A wrong name, signature, target, or argument becomes a runtime failure when that path is exercised.

Reflection also weakens the visible type flow. `invoke()` returns `Object`, so callers often cast. Generic reflection describes declarations, but it does not recreate all compile-time generic safety.

That is not a reason to ban reflection. A framework performing dynamic discovery cannot require the compiler to know every implementation in advance. A safer design confines dynamic resolution to a small boundary, validates early, and exposes typed APIs to the rest of the application.

```text
dynamic config/metadata
        ↓ validate once
reflection adapter / registry
        ↓ typed contract
application code
```
