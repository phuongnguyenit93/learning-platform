A processor declares which annotation types it supports. `AbstractProcessor` can derive this from `@SupportedAnnotationTypes`:

```java
@SupportedAnnotationTypes("com.example.GenerateMapper")
public final class MapperProcessor extends AbstractProcessor {
    // ...
}
```

Patterns may also use `*` according to the processor API contract when a processor intentionally supports a broader set.

The processor also declares the latest source version whose language model it supports. For Java 21 code, a processor can state:

```java
@SupportedSourceVersion(SourceVersion.RELEASE_21)
public final class MapperProcessor extends AbstractProcessor {
    // ...
}
```

or override `getSupportedSourceVersion()` when a dynamic policy is appropriate.

### WHY — source version is a compatibility claim

Do not blindly claim a newer source version merely to silence a warning. New Java releases can add element kinds, syntax, or model details that processor logic must handle correctly.

```text
processor declares RELEASE_21
→ claims it understands the Java 21 source/model level it will inspect
```

The annotation type set and source version together define when the compiler should consider the processor applicable and what language model the processor claims to understand.

### Processor options with `@SupportedOptions`

A processor can also declare build-level options that it understands:

```java
@SupportedOptions("mapper.debug")
@SupportedAnnotationTypes("com.example.GenerateMapper")
@SupportedSourceVersion(SourceVersion.RELEASE_21)
public final class MapperProcessor extends AbstractProcessor {
}
```

A compiler/build tool can pass a processor option in a form such as:

```text
-Amapper.debug=true
```

and the processor can read it from:

```java
String debug =
        processingEnv.getOptions().get("mapper.debug");
```

Processor options are build-level inputs. Annotation elements are metadata attached to particular declarations/types; they solve a different configuration problem.
