getModifiers() lets framework code interpret the role of a field:

~~~java
Field field = PaymentService.class.getDeclaredField("available");
int modifiers = field.getModifiers();

boolean isStatic = Modifier.isStatic(modifiers);
boolean isFinal = Modifier.isFinal(modifiers);
boolean isVolatile = Modifier.isVolatile(modifiers);
boolean isTransient = Modifier.isTransient(modifiers);
boolean isPrivate = Modifier.isPrivate(modifiers);
~~~

These flags often drive policy:

~~~text
static
→ class-level state; object mappers often exclude it

final
→ the field value/reference may be assigned only according to final-field rules;
  if it refers to a mutable object, that object's internal state can still change

transient
→ metadata serializers often consider excluding,
  though the final behavior is serializer-specific

volatile
→ the field keeps Java's memory-visibility semantics;
  Reflection only reports/uses the field, it does not redefine those semantics
~~~

Do not treat final as “Reflection can safely mutate it if access is forced open.” Modern Java imposes important restrictions on reflective writes to final fields, and even cases that can be changed may conflict with JVM/compiler assumptions. Framework code should treat final as a design boundary, not as an obstacle to defeat casually.

Field also provides:

~~~java
field.isEnumConstant();
field.isSynthetic();
~~~

Those properties are not simply inferred from the normal Modifier bit mask.

A snapshot tool might define a clear policy:

~~~java
static boolean shouldRead(Field field) {
    int m = field.getModifiers();
    return !Modifier.isStatic(m)
            && !field.isSynthetic();
}
~~~

An explicit policy is safer than “process everything reflection exposes,” because runtime metadata can include members created for compiler/JVM purposes rather than domain modeling.
