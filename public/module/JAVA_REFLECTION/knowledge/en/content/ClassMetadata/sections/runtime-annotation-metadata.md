One major reflection use case is consuming annotations retained with `RUNTIME`. Reflection does not decide annotation lifetime; retention, target, repeatability, and inheritance semantics belong to the Annotation module. Here the annotation is viewed from the **runtime consumer** side.

`Class`, `Field`, `Method`, `Constructor`, `Parameter`, `RecordComponent`, and many other reflective elements participate in the `AnnotatedElement` contract, giving them a largely shared lookup vocabulary. In the example below, assume `@Audit` is a custom annotation declared with `RUNTIME` retention in the Annotation module:

~~~java
Deprecated deprecated = PaymentService.class
        .getAnnotation(Deprecated.class);

Annotation[] declared = PaymentService.class
        .getDeclaredAnnotations();

Audit[] audits = PaymentService.class
        .getAnnotationsByType(Audit.class);
~~~

These calls answer different questions:

- `getAnnotation(...)` follows the `AnnotatedElement` "present" lookup semantics;
- `getDeclaredAnnotation(...)` / `getDeclaredAnnotations()` inspect only the current declaration;
- `getAnnotationsByType(...)` is appropriate when an annotation can repeat and container semantics matter.

Reflection sees only annotations that survive to runtime. A `SOURCE`- or `CLASS`-retained annotation does not become visible through these runtime APIs merely because it existed in source or the class file.

~~~text
Annotation module
→ define the metadata contract and retention

Reflection module
→ consume RUNTIME metadata and choose runtime behavior
~~~
