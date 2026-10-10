Reflection can move from a type to its direct inheritance relationships:

~~~java
Class<?> type = PaymentService.class;

Class<?> parent = type.getSuperclass();
Class<?>[] interfaces = type.getInterfaces();
~~~

For the running PaymentService:

~~~text
getSuperclass() → java.lang.Object
getInterfaces() → [PaymentProcessor]
~~~

getInterfaces() returns the interfaces a class directly implements, or the superinterfaces an interface directly extends. It does not flatten the entire interface graph. A framework that needs the full closure must traverse further and avoid revisiting the same interfaces.

Important getSuperclass() boundaries include:

| Type | getSuperclass() |
| --- | --- |
| ordinary class | direct superclass |
| Object | null |
| interface | null |
| primitive | null |
| void | null |
| array | Object |

Array classes also report Cloneable and Serializable through getInterfaces(), even though programmers never write a normal class declaration for an array type.

A simple superclass traversal looks like:

~~~java
static List<Class<?>> classHierarchy(Class<?> type) {
    List<Class<?>> result = new ArrayList<>();
    for (Class<?> current = type;
         current != null;
         current = current.getSuperclass()) {
        result.add(current);
    }
    return result;
}
~~~

When generic superclass/interface signatures matter, `Class` also provides `getGenericSuperclass()` and `getGenericInterfaces()`. The full `Type` model belongs to **Generic Signature Metadata after Erasure**; `Class<?>` alone is not the entire generic metadata story.
