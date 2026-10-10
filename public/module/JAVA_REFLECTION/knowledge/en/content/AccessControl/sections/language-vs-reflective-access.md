With ordinary Java code, the compiler checks `public`, `protected`, package-private, and `private` access at the call site. A class outside `PaymentService` cannot write `service.internalStatus()` because that call violates Java access rules.

Reflection separates the operation into two stages. First comes **discovery**: obtain a descriptor for the member. Then comes **use**: read or write a field, invoke a method, or call a constructor. `getDeclaredMethod()` may return a descriptor for a private method, but `Method.invoke()` still performs access checks unless those checks have been suppressed.

```java
PaymentService service = new PaymentService("demo");
Method method = PaymentService.class.getDeclaredMethod("internalStatus");

System.out.println(method.getName());          // internalStatus
System.out.println(method.canAccess(service)); // commonly false for an outside caller

method.invoke(service); // IllegalAccessException if the caller has no access
```

This is why merely seeing a private member through reflection does not erase encapsulation. A descriptor is metadata; permission to operate on the member is a separate boundary.

`canAccess(obj)` asks whether the caller can currently use that reflected member. For instance fields and methods, `obj` must be a compatible instance; for static members and constructors, it must be `null`. This is clearer than the old `isAccessible()` API, whose name only reported whether access-check suppression was enabled.
