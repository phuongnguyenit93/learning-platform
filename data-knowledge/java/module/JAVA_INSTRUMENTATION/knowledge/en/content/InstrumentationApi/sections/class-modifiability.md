JVM support for retransform/redefine **does not make every Class modifiable**. isModifiableClass(type) answers the per-class question.

~~~java
if (!inst.isRetransformClassesSupported()) {
    return;
}
if (!inst.isModifiableClass(OrderService.class)) {
    return;
}
inst.retransformClasses(OrderService.class);
~~~

Primitive classes and array classes are never modifiable. A JVM implementation may also make additional classes unmodifiable.

Keep the two levels separate:

~~~text
JVM-level capability
→ "does this runtime support retransform/redefine?"

class-level modifiability
→ "may this specific class be changed?"
~~~

Skipping the second check commonly ends in UnmodifiableClassException.
