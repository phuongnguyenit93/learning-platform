For content, `getResourceAsStream` is often simpler than converting a URL yourself:

```java
ClassLoader loader = HelloPlugin.class.getClassLoader();

try (InputStream in = loader.getResourceAsStream("demo/plugins/plugin.properties")) {
    if (in == null) {
        throw new IllegalStateException("plugin.properties is missing");
    }

    Properties properties = new Properties();
    properties.load(in);
}
```

The returned stream may be backed by a file, a JAR entry, a runtime image, a network-capable custom loader, or another source. The caller should close it with try-with-resources.

For text resources, also choose the character encoding explicitly when the file format does not define one through its own API:

```java
try (InputStream in = loader.getResourceAsStream("shared/banner.txt")) {
    if (in == null) {
        throw new IllegalStateException("banner missing");
    }

    String text = new String(in.readAllBytes(), StandardCharsets.UTF_8);
    System.out.println(text);
}
```

Do not use `InputStream.available()` as the resource length. It describes bytes readable without blocking, not the total content size.

This lifecycle is separate from ClassLoader unloading. Closing a resource stream releases that stream's underlying resource; it does not unload classes. Conversely, keeping archive/resource handles open unnecessarily can make plugin replacement operationally difficult even when type reachability is otherwise correct.
