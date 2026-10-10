Modern Java code generally prefers `java.nio.file.Path` to represent paths and `java.nio.file.Files` to perform filesystem operations.

```text
legacy
File
  └─ pathname + operations on one type

modern NIO.2
Path
  └─ path representation

Files
  └─ filesystem operations
```

`File` still appears throughout older APIs and existing libraries, so understanding it remains useful. Java provides a direct bridge:

```java
java.io.File legacy = new java.io.File("data/report.txt");
java.nio.file.Path path = legacy.toPath();
java.io.File back = path.toFile();
```

`Path`/`Files` commonly provide clearer operations and richer exception information:

```java
java.nio.file.Path path = java.nio.file.Path.of("data", "report.txt");

try {
    java.nio.file.Files.delete(path);
} catch (java.nio.file.NoSuchFileException e) {
    System.out.println("File does not exist: " + e.getFile());
}
```

That boundary leads directly into the next chapter: once the learner understands `File` as the legacy pathname model and sees its limits, `Path` and `Files` provide the modern path and filesystem-operation model.
