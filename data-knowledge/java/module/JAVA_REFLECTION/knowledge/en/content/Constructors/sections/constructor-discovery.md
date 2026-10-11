Constructors are not inherited, so their hierarchy rules are simpler than methods, but Java still exposes public and declared views:

~~~java
Constructor<PaymentService> publicCtor =
        PaymentService.class.getConstructor(String.class);

Constructor<PaymentService> declaredCtor =
        PaymentService.class.getDeclaredConstructor(
                String.class,
                int.class
        );
~~~

getConstructor(...) finds a public constructor declared by the class. getDeclaredConstructor(...) finds a constructor declared by the class at any visibility.

The parameter types must match the declaration exactly during discovery:

~~~java
PaymentService.class.getDeclaredConstructor(
        String.class,
        Integer.class
);
// NoSuchMethodException if the real constructor accepts int
~~~

Like Method discovery, constructor lookup does not run compiler-style overload resolution and does not treat Integer.class as equivalent to int.class.

For enumeration:

~~~java
Constructor<?>[] publicCtors =
        PaymentService.class.getConstructors();

Constructor<?>[] allDeclaredCtors =
        PaymentService.class.getDeclaredConstructors();
~~~

Frameworks should not pick “the first constructor” as an implicit policy. Reflection array order is not a source-level semantic contract. A DI container should define an explicit rule such as an annotation, a single available constructor, or another documented selection policy.

A frequent mistake is assuming every class has a no-argument constructor:

~~~java
PaymentService.class.getDeclaredConstructor();
// NoSuchMethodException for the baseline PaymentService
~~~

Java supplies a default no-argument constructor only when the source declares no constructor at all. Once PaymentService(String provider) exists, the compiler does not silently add PaymentService().

Non-static inner classes provide another edge case: the runtime constructor signature normally includes a parameter for the enclosing instance. The reflective signature can therefore contain a parameter that is less obvious from ordinary source-level construction syntax.
