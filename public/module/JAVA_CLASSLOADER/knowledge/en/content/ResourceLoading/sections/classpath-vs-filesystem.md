During development, a resource may happen to live in a directory such as:

```text
build/resources/main/shared/banner.txt
```

That can make code like this appear reasonable:

```java
URL url = loader.getResource("shared/banner.txt");
Path path = Path.of(url.toURI());
```

But after packaging, the URL might identify a JAR entry rather than a normal filesystem file. JDK runtime resources may also use the `jrt:` scheme. A custom loader can expose still other URL protocols.

```text
development directory → file:...
packaged dependency    → jar:file:...!/shared/banner.txt
runtime image          → jrt:...
```

Therefore, if the operation only needs to **read resource content**, prefer `getResourceAsStream` and stay independent of the physical storage mechanism.

Use filesystem APIs only when the application contract truly requires a filesystem path. If an external library requires a `Path`, the application may need to copy the classpath resource to a temporary file or explicitly mount/open the relevant archive filesystem; that is a deployment decision, not a generic property of classpath resources.
