Fields are not virtual and do not participate in dynamic dispatch.

```java
class Parent { String name = "parent"; }
class Child extends Parent { String name = "child"; }

Parent value = new Child();
System.out.println(value.name); // parent
```

The expression `value.name` resolves the field from compile-time type `Parent`. This is field hiding, not polymorphic state dispatch.

The `Parent.name` and `Child.name` declarations represent **two distinct members/slots**, not one field chosen dynamically. Different static types or casts can expose different fields on the same runtime object, which is why field hiding is usually best avoided.

Avoid reusing the same field name across a hierarchy unless there is a strong reason because it creates a confusing mental model.
