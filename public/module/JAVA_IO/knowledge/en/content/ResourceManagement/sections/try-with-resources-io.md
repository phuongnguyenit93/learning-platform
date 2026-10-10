Manually placing `close()` after work is easy to get wrong:

~~~java
InputStream in = Files.newInputStream(path);
byte[] data = in.readAllBytes();
in.close();
~~~

If `readAllBytes()` throws, the final line is skipped. Try-with-resources binds cleanup to the language construct:

~~~java
try (InputStream in = Files.newInputStream(path)) {
    byte[] data = in.readAllBytes();
    System.out.println(data.length);
}
~~~

When execution leaves the block, Java calls `close()` whether the body completed normally or threw.

Several resources can be declared together:

~~~java
try (
        InputStream in = Files.newInputStream(source);
        OutputStream out = Files.newOutputStream(target)
) {
    in.transferTo(out);
}
~~~

They close in reverse declaration order: `out` first, then `in`. That ordering is useful when a later resource depends on an earlier one.

If the body throws and closing also throws, Java keeps the primary failure and records close failures as suppressed exceptions. That fact is useful when reading I/O failures; the full exception/suppression model belongs to the exception learning module rather than this I/O chapter.

Since Java 9, an existing final or effectively-final variable can also appear in the resource header:

~~~java
InputStream in = Files.newInputStream(path);

try (in) {
    System.out.println(in.read());
}
~~~

For I/O, try-with-resources should be the default when ownership fits a lexical scope.
