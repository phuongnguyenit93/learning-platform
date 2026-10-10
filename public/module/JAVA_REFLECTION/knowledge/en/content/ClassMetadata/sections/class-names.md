Class exposes several naming APIs because “the name of a type” serves different purposes.

~~~java
Class<?> type = PaymentService.class;

System.out.println(type.getName());
System.out.println(type.getSimpleName());
System.out.println(type.getCanonicalName());
System.out.println(type.getTypeName());
~~~

For an ordinary top-level class, the output is straightforward:

~~~text
getName()          → com.example.PaymentService
getSimpleName()    → PaymentService
getCanonicalName() → com.example.PaymentService
getTypeName()      → com.example.PaymentService
~~~

These methods are not interchangeable.

getName() returns the **binary name** for an ordinary class or interface. Nested classes therefore use the $ form:

~~~java
class PaymentModule {
    static class Config {}
}

System.out.println(PaymentModule.Config.class.getName());
// com.example.PaymentModule$Config
~~~

getSimpleName() returns a short display-oriented name, but an anonymous class may return an empty string. It should not be treated as a globally stable identifier for persistence, serialization, or registries.

getCanonicalName() returns a canonical name when the type has one. Local and anonymous classes may return null, so framework code must not assume that every Class maps cleanly to a source-style canonical name.

getTypeName() is designed for readable type descriptions. Arrays show why it can be preferable to getName():

~~~java
System.out.println(String[].class.getName());      // [Ljava.lang.String;
System.out.println(String[].class.getTypeName());  // java.lang.String[]
~~~

Primitive types also have names:

~~~java
System.out.println(int.class.getName());      // int
System.out.println(int.class.getTypeName());  // int
~~~

Choose the naming API according to the contract: binary names for lookups such as Class.forName(...), simple names for display, and canonical/type names for readable descriptions when applicable.
