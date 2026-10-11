An end-to-end miniature example makes the pipeline concrete.

Application annotation:

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.SOURCE)
public @interface GenerateMapper {
}
```

Application source:

```java
@GenerateMapper
class Order {
}
```

Processor logic:

```java
public final class MapperProcessor extends AbstractProcessor {

    @Override
    public boolean process(
            Set<? extends TypeElement> annotations,
            RoundEnvironment roundEnv) {

        for (Element element :
                roundEnv.getElementsAnnotatedWith(GenerateMapper.class)) {

            String generatedName =
                    element.getSimpleName() + "MapperGenerated";

            try {
                JavaFileObject file =
                        processingEnv.getFiler()
                                .createSourceFile(generatedName, element);

                try (Writer writer = file.openWriter()) {
                    writer.write(
                            "final class " + generatedName + " {}"
                    );
                }
            } catch (IOException e) {
                processingEnv.getMessager().printMessage(
                        Diagnostic.Kind.ERROR,
                        e.getMessage(),
                        element
                );
            }
        }

        return true;
    }
}
```

Observable flow:

```text
@GenerateMapper on Order
→ roundEnv discovers Order
→ processor calls Filer
→ OrderMapperGenerated.java is created
→ output is closed
→ compiler observes the generated source in a later round
→ generated source compiles like ordinary Java source
```

`Filer` is the standard output boundary for generated artifacts.

```java
JavaFileObject file = processingEnv.getFiler()
        .createSourceFile("com.example.generated.AuditIndex", element);

try (Writer writer = file.openWriter()) {
    writer.write("""
            package com.example.generated;

            public final class AuditIndex {
                private AuditIndex() {}
            }
            """);
}
```

Generated source files are compiled in later rounds of the same compilation when applicable. `Filer.createResource(...)` can similarly produce resources in supported output locations.

The optional originating elements passed to `createSourceFile`, `createClassFile`, or `createResource` describe which program elements caused the output. Build tools may use that relationship for dependency/incremental reasoning.

### BOUNDARY — generate new artifacts; do not rewrite user source

The standard annotation-processing model is designed around inspecting elements and creating new files through `Filer`. It is not a portable source-rewriting API.

```text
inspect @Audit declarations
→ generate AuditIndex.java
→ compiler sees generated type in a later round
```

Trying to generate the same file again in another round causes a filer error. Processors must therefore keep generation idempotent at the logical level and understand which round owns each output.
