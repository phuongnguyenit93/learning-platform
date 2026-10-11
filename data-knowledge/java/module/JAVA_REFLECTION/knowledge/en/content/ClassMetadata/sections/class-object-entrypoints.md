Reflection normally begins with a Class<?> object. A Class object is not the source code of a class; it is the runtime object that represents a type known to the JVM.

Three common entry points are:

~~~java
// 1. The type is known directly in source
Class<PaymentService> a = PaymentService.class;

// 2. An object is available, but its concrete type may not be known
Object service = new PaymentService("stripe");
Class<?> b = service.getClass();

// 3. Only the binary class name is known at runtime
Class<?> c = Class.forName("com.example.PaymentService");
~~~

A class literal fits code that already references the type. Object.getClass() is common in framework code that receives an arbitrary object and wants its concrete runtime class. Class.forName(...) is useful for plugin/configuration scenarios where the class name arrives at runtime.

`Class<T>` also carries compile-time type information. `Class<PaymentService>` says that this `Class` object represents `PaymentService`. `Class<?>` means "this is a valid `Class` object, but the concrete represented type is not known here." Framework code commonly works with `Class<?>` precisely because discovering the concrete type is part of the runtime problem; it then validates metadata before casting or operating on values.

Primitive and array types also have Class objects:

~~~java
Class<Integer> primitive = int.class;
Class<String[]> array = String[].class;
~~~

`Class.forName(String)` **initializes the class by default** after locating/loading it, so static initialization may run. The overload `Class.forName(name, false, loader)` can request that initialization not happen at that step. The detailed lifecycle and class-identity rules belong to the ClassLoader module; the important point here is that resolving a class by name can have different side effects from simply using a class literal.

Once a Class<?> exists, reflection can move into more specific questions:

~~~java
Class<?> type = PaymentService.class;

String name = type.getName();
Field[] fields = type.getDeclaredFields();
Method[] methods = type.getDeclaredMethods();
Constructor<?>[] constructors = type.getDeclaredConstructors();
~~~

The rest of **Runtime Type Model with Class<?>** explores what the runtime knows about the type itself. The Field, Method, and Constructor chapters then focus on each member kind.
