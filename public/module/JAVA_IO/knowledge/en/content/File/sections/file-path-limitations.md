`File` handles many basic cases, but the older API has several important limitations.

First, many operations report failure with a `boolean` instead of giving detailed error information:

```java
java.io.File file = new java.io.File("data/report.txt");

if (!file.delete()) {
    System.out.println("Delete failed, but boolean alone does not explain why");
}
```

Failure could mean the file does not exist, permissions are missing, another process is using the file, the filesystem rejected the operation, or something else. A lone `false` is not enough to distinguish those causes.

Second, string-shaped path handling tends to mix several concepts:

- relative versus absolute paths;
- a **separator**, the character between path components, which is platform-specific such as `/` or `\`;
- `.` meaning “the current directory” and `..` meaning “the parent directory” in path syntax;
- **symbolic links (symlinks)** — filesystem entries that redirect to another path/target — and **canonical paths**, where filesystem-dependent path details have been resolved;
- operations on a path versus operations on file contents.

`getAbsoluteFile()` produces an absolute representation using the current environment. `getCanonicalFile()` additionally resolves filesystem-dependent path details and can perform I/O, so it may throw `IOException`. They are not interchangeable concepts.

Third, `File` does not provide as rich a model as **NIO.2**, the commonly used name for Java's newer filesystem API family in `java.nio.file` such as `Path` and `Files`, for attributes, symbolic links, directory-tree walking, copy/move options, or detailed failures.
