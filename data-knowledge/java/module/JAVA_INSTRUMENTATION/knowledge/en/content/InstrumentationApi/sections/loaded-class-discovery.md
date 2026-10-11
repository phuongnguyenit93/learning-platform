Two discovery APIs are easy to confuse:

- getAllLoadedClasses(): all classes currently loaded by the JVM;
- getInitiatedClasses(loader): classes for which that loader is an initiating loader according to the API's lookup/linkage semantics.

getAllLoadedClasses() includes hidden classes/interfaces and array classes. In contrast, getInitiatedClasses(loader) excludes hidden classes/interfaces (and arrays whose element type is hidden) because those types are not discoverable through ClassLoader::loadClass/Class::forName.

A dynamic agent often scans getAllLoadedClasses() to find targets that are already present:

~~~java
for (Class<?> type : inst.getAllLoadedClasses()) {
    if (type.getName().equals("com.example.OrderService")
            && inst.isModifiableClass(type)) {
        inst.retransformClasses(type);
    }
}
~~~

Do not scan and retransform everything. Targeting should filter by package/class/loader/module to avoid instrumenting agent helpers, touching unintended JDK classes, creating dependency cycles, or adding unnecessary runtime cost.

Discovery exposes runtime inventory; it does not replace a ClassLoader mental model.
