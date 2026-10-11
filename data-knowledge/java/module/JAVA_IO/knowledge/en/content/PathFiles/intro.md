# Path, Files, and the Modern Filesystem Model

After `java.io.File`, modern Java usually works with the filesystem through two separate roles: `Path` represents a **path**, while `Files` performs **I/O operations and metadata queries** on that path. This separation lets us answer two different questions: where is the resource, and what operation should be performed on it?

The examples in this chapter use a temporary directory and a UTF-8 text file:

~~~java
Path tempDir = Files.createTempDirectory("io-demo-");
Path note = tempDir.resolve("note.txt");
String text = "Hello Java I/O";
~~~
