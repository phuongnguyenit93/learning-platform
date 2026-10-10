A processor implements `javax.annotation.processing.Processor`. Most processors extend `AbstractProcessor`, which provides standard lifecycle support.

The standard processor model spans two closely related packages:

- `javax.annotation.processing` — processor lifecycle and services;
- `javax.lang.model` — declarations and compile-time types exposed by the compiler.

Use this mental model before reading processor code:

```text
Element
→ a source/model declaration such as a class, method, field, or parameter

TypeElement
→ an Element representing a type declaration such as a class/interface/record/annotation interface

TypeMirror
→ a Java type represented at compile time

AnnotationMirror
→ an annotation represented in the compiler model

Elements
→ utility service for declaration-model queries

Types
→ utility service for type-model queries/comparisons
```

```java
public final class MapperProcessor extends AbstractProcessor {

    @Override
    public boolean process(
            Set<? extends TypeElement> annotations,
            RoundEnvironment roundEnv) {

        for (Element element :
        roundEnv.getElementsAnnotatedWith(GenerateMapper.class)) {
            // inspect element model
        }

        return true;
    }
}
```

Returning `true` means the processor claims the annotation types it was asked to process for that round, so subsequent processors are not asked to process those claimed types. Returning `false` leaves them unclaimed for other processors.

`AbstractProcessor` exposes the compiler environment after initialization through `processingEnv`. Useful services include:

```text
Messager
→ emit diagnostics attached to compilation

Filer
→ create generated source/class/resource files

Elements
→ query language-model elements

Types
→ query/compare language-model types
```

Prefer `Messager` for processor diagnostics rather than printing arbitrary text to standard output:

```java
processingEnv.getMessager().printMessage(
        Diagnostic.Kind.ERROR,
        "@GenerateMapper requires a valid type declaration",
        element
);
```

That lets the compiler associate the message with the relevant program element.

### DISCOVERY — how does the compiler find a processor?

A processor can be named explicitly with compiler options, discovered as a service provider (for example through `META-INF/services/javax.annotation.processing.Processor`), or provided through the Java module system with an appropriate `provides ... with ...` declaration.

Discovery/configuration is part of the build contract. Merely placing a `Processor` implementation somewhere in application source does not guarantee it will participate in compilation.

The processor itself must already be compiled and made available to the compiler/build tool before it can process the application's source:

```text
processor source
→ compile processor library/JAR
        ↓
build tool / javac puts it on the processor path
        ↓
compiler discovers and initializes processor
        ↓
process(...) participates in rounds
```
