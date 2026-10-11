Constructor reflection can fail at several different stages. Separating them lets a framework report the real cause instead of reducing everything to “reflection failed.”

| Failure | Meaning |
| --- | --- |
| NoSuchMethodException | Discovery did not find a constructor with the exact parameter types |
| IllegalAccessException | The constructor exists but reflective access is denied |
| InstantiationException | The declaring class cannot be instantiated through the constructor contract, such as an abstract class |
| IllegalArgumentException | Argument count/type is wrong, or the target is a case Reflection forbids constructing such as an enum |
| InvocationTargetException | The constructor body ran and threw an exception |
| ExceptionInInitializerError | Class initialization was triggered and static initialization failed |

Example: distinguish a protocol failure from a constructor/domain failure:

~~~java
Constructor<PaymentService> constructor =
        PaymentService.class.getConstructor(String.class);

try {
    PaymentService service = constructor.newInstance("");
} catch (InvocationTargetException ex) {
    Throwable constructorFailure = ex.getCause();
    // e.g. IllegalArgumentException("provider is required")
}
~~~

Passing Integer instead of String:

~~~java
constructor.newInstance(123);
~~~

fails the reflective invocation contract rather than the constructor's business validation.

Enums are a special case: enum instances are controlled by the JVM according to the enum declaration, and Constructor.newInstance cannot create additional enum constants.

A private or package-private constructor can still be **discovered** with getDeclaredConstructor(...), but discovery is not permission to invoke it. Whether reflective access can be enabled depends on language/module boundaries and runtime policy. Access Control picks up directly from this point.

At this point the learner has the **three core operations** of this milestone:

~~~text
descriptors have already been discovered
    ↓
Field.get/set
Method.invoke
Constructor.newInstance
    ↓
validate receiver / arguments / conversions / target failures
    ↓
encounter the reflective access boundary
~~~

Before moving to access boundaries, one more synthesis step is useful: model the **reflective dispatch flow** and the checks a dynamic call passes through.
