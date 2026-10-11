> **Beginner boundary:** understand why the `...ByType(...)` APIs exist and how `@Inherited` changes lookup. The full Reflection API surface belongs to the Reflection module.

Before choosing an API, distinguish the four lookup terms Java uses:

```text
directly present
→ annotation T is attached directly to the element

indirectly present
→ annotation T is inside the directly present container of a repeatable annotation

present
→ directly present
→ or, for a class and an @Inherited annotation type, found through the superclass rule

associated
→ directly present or indirectly present
→ or, for a class and an @Inherited annotation type, fallback to a superclass when no local associated T exists
```

That vocabulary explains the core lookup APIs:

| API | Unwraps repeatable container | Uses superclass `@Inherited` lookup |
| --- | --- | --- |
| `getDeclaredAnnotation(T)` | no | no |
| `getAnnotation(T)` | no | yes for classes when `T` is `@Inherited` |
| `getDeclaredAnnotationsByType(T)` | yes | no |
| `getAnnotationsByType(T)` | yes | yes for classes when `T` is `@Inherited` |
| `isAnnotationPresent(T)` | same single-annotation presence semantics as `getAnnotation(T) != null` | correspondingly |

This is why `getAnnotation(T)` should not be treated as “return the first repeated annotation”.

For repeatable annotations, prefer APIs that retrieve annotations **by type**:

```java
Method method = PaymentService.class.getDeclaredMethod("pay");

Audit[] audits = method.getAnnotationsByType(Audit.class);

for (Audit audit : audits) {
    System.out.println(audit.action());
}
```

`getAnnotationsByType(Audit.class)` understands the repeatable/container relationship and returns the individual `Audit` instances in the associated order.

By contrast, asking for one annotation does not mean “give me the first repeated one”:

```java
method.getAnnotation(Audit.class);
```

When multiple `@Audit` uses are represented through the container, `getAnnotation(Audit.class)` does not unpack that container into an arbitrary single result.

### DECLARED vs inherited lookup

Two families are useful to separate:

```text
getDeclaredAnnotationsByType(...)
→ annotations associated directly/indirectly with this element
→ no superclass inheritance search

getAnnotationsByType(...)
→ includes the applicable inherited class lookup semantics
→ relevant when the annotation type is @Inherited
```

For methods, fields, and other non-class elements, `@Inherited` does not introduce superclass lookup behavior.

For an inherited repeatable annotation on a class, this is a **fallback lookup**, not accumulation across the whole hierarchy. If the current class already has an associated annotation of that type, `getAnnotationsByType(...)` uses that local associated set rather than merging it with repeated values from every superclass.
