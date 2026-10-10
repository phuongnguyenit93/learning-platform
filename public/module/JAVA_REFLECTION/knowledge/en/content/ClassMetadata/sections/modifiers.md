getModifiers() returns a bit mask. java.lang.reflect.Modifier provides helpers for interpreting the relevant bits.

~~~java
int modifiers = PaymentService.class.getModifiers();

System.out.println(Modifier.isPublic(modifiers));
System.out.println(Modifier.isAbstract(modifiers));
System.out.println(Modifier.isFinal(modifiers));
System.out.println(Modifier.toString(modifiers));
~~~

An object factory can use modifier metadata to reject obviously non-instantiable classes before constructor discovery:

~~~java
static boolean canConstruct(Class<?> type) {
    int modifiers = type.getModifiers();
    return !type.isInterface()
            && !Modifier.isAbstract(modifiers)
            && !type.isEnum()
            && !type.isPrimitive()
            && !type.isArray();
}
~~~

This is still only an early filter. Passing these checks does not guarantee that the framework can construct the type: a suitable constructor, reflective access, compatible arguments, and constructor-body failures still have to be handled during Constructor Reflection.

Modifier bits must be interpreted in the context of the element being inspected. The Modifier API is shared by classes, fields, methods, and constructors, but not every modifier is meaningful for every kind of element.

There is no dedicated “package-private” bit. If public, protected, and private are all false, the source-level access may be package-private, but actual reflective accessibility still depends on caller context. Access Control handles that later.

Properties such as synthetic, annotation, enum, or record also have dedicated APIs because they are not simply ordinary source modifiers.

Java 21 also exposes `accessFlags()`, which returns `Set<AccessFlag>` so class-file/JVM access and property flags can be inspected as enum values rather than only as a bit mask:

~~~java
Set<AccessFlag> flags = PaymentService.class.accessFlags();
System.out.println(flags.contains(AccessFlag.PUBLIC));
System.out.println(flags.contains(AccessFlag.FINAL));
~~~

`Modifier` remains the familiar core API for Java modifiers. `AccessFlag` is a newer model for flags represented in JVM/class-file metadata; the two APIs are related but are not merely different spellings of the same abstraction. `Field`, `Method`, and `Constructor`/`Executable` also expose `accessFlags()` when tooling needs this lower-level flag model.
