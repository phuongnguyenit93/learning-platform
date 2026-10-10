Processing and reflection consume metadata at different lifecycle stages and through different program models.

| Question | Annotation processing | Runtime reflection |
| --- | --- | --- |
| When? | During compilation | While application/runtime code executes |
| Main model | `Element`, `TypeMirror`, compiler model | `Class`, `Method`, `Field`, etc. |
| Can see SOURCE-retained annotations during compilation? | Yes, when applicable to the processing model | No |
| Can generate source files and build resources? | Yes | Not as part of compiler processing rounds |
| Requires `RUNTIME` retention for annotation lookup? | No | Yes for ordinary reflective annotation access |

For example, a compile-time processor can validate `@Audit` usage and generate an index even if `@Audit` is SOURCE-retained. A runtime library that calls `Method.getAnnotation(Audit.class)` requires the annotation to survive with RUNTIME retention.

### `Class`-valued annotation elements at compile time

If an annotation element has a type such as `Class<?>`, processor code should not assume the referenced user type can be loaded as a runtime `Class`. General processors are usually safer working with `AnnotationMirror` and `TypeMirror`. Proxy-style access to class-valued elements can surface `MirroredTypeException` or `MirroredTypesException` because the compiler is representing source types, not running application classes.

```text
compile-time consumer
→ annotation processing module boundary

runtime metadata inspection
→ reflection module boundary
```

Do not model annotation processing as “reflection that happens earlier”. The APIs, available information, lifecycle, and outputs are different.
