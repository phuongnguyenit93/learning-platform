The name `File` can mislead beginners into thinking the object is “an opened file.” In practice, a `java.io.File` primarily represents a **pathname** — a value describing the name/location of a file or directory in a filesystem. An **absolute pathname** identifies a location from a filesystem root/base, while `java.io` resolves a **relative pathname** against the current user directory named by the `user.dir` system property, typically the directory in which the JVM was launched. The object can exist even when the target does not. The JDK phrase “abstract pathname” emphasizes that this is a path model, not an opened file handle.

```text
java.io.File object
    ↓ stores a pathname
"data/report.txt"
    ↓ when an operation consults the filesystem
exists? isFile? isDirectory? length? mkdir? delete? ...
```

Constructing a `File` does not open a file and does not guarantee the path exists:

```java
java.io.File file = new java.io.File("data/report.txt");

System.out.println(file.getPath());
System.out.println(file.exists());
```

The first line can always print the pathname stored by the object. `exists()` is the operation that asks the filesystem about its current state.

`File` can also represent a directory:

```java
java.io.File tempDir =
    new java.io.File(System.getProperty("java.io.tmpdir"));

System.out.println(tempDir.isDirectory());
```

The useful mental model is therefore **pathname + legacy filesystem operations**, not “a handle currently reading or writing file contents.” Content still requires a stream/reader/writer or a modern NIO API.
