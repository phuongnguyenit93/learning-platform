A Class<?> can represent several different kinds of Java type. Framework rules often need to classify the type before doing anything else.

~~~java
Class<?> type = PaymentService.class;

boolean interfaceType = type.isInterface();
boolean enumType = type.isEnum();
boolean recordType = type.isRecord();
boolean annotationType = type.isAnnotation();
boolean arrayType = type.isArray();
boolean primitiveType = type.isPrimitive();
boolean syntheticType = type.isSynthetic();
~~~

Examples:

~~~java
record PaymentRequest(String orderId, long amount) {}
enum PaymentStatus { CREATED, PAID }

System.out.println(PaymentProcessor.class.isInterface()); // true
System.out.println(PaymentRequest.class.isRecord());      // true
System.out.println(PaymentStatus.class.isEnum());         // true
System.out.println(String[].class.isArray());              // true
System.out.println(long.class.isPrimitive());              // true
~~~

These distinctions matter because different kinds of type obey different rules. A serializer may handle records through record components. A proxy mechanism may require an interface. An object factory cannot instantiate an abstract class as if it were concrete. Arrays have Class objects even though there is no ordinary source-level class declaration for each array type.

The categories are not always mutually exclusive. An annotation type is also an interface in the Java type system, so framework code should test the property it actually cares about instead of assuming the isXxx() methods create a single exclusive taxonomy.

isSynthetic() identifies declarations generated and marked synthetic by the compiler. Reflection can expose artifacts that are not obvious in source, so tools often need an explicit policy for including or filtering them.

Beyond asking "what kind of type is this?", framework code often needs to validate **runtime type relationships** before casting or registering an implementation. `Class` provides checked APIs that are safer than blind casts:

~~~java
Class<?> discovered = PaymentService.class;
Object service = new PaymentService("stripe");

System.out.println(discovered.isInstance(service));
// true — the dynamic equivalent of an instanceof-style check

System.out.println(
        PaymentProcessor.class.isAssignableFrom(discovered)
);
// true — a PaymentService value can be assigned to PaymentProcessor

PaymentService typed = PaymentService.class.cast(service);

Class<? extends PaymentProcessor> processorType =
        discovered.asSubclass(PaymentProcessor.class);
~~~

The direction of `isAssignableFrom(...)` is easy to reverse accidentally. Read `A.isAssignableFrom(B)` as: **can a value of B be assigned to a variable of type A?** `cast(...)` performs a checked runtime cast; `asSubclass(...)` performs the corresponding check at the `Class`-object level and throws `ClassCastException` when the discovered type is not an appropriate subtype.
