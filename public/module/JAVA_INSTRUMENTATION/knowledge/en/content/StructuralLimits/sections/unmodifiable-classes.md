Not every Class is modifiable.

The Instrumentation API guarantees that:

- primitive classes are not modifiable;
- array classes are not modifiable;
- a JVM implementation may expose additional unmodifiable classes.

Check first:

~~~java
if (!inst.isModifiableClass(target)) {
    // skip or report unsupported target
    return;
}
~~~

Hidden classes/interfaces **cannot be modified by Java agents or JVMTI agents**. getAllLoadedClasses() can still expose them, so obtaining a Class object does not imply redefine/retransform capability; isModifiableClass() must report false for this case.

A good tool reports “target exists but is not modifiable” instead of exposing only an unexplained UnmodifiableClassException.
