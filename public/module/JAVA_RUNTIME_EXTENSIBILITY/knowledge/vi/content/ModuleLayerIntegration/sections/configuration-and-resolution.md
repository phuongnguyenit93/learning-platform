`ModuleFinder` tìm module artifacts; `Configuration` biểu diễn **resolved readability graph**.

Ví dụ:

```java
Path plugins = Path.of("plugins");
ModuleFinder finder = ModuleFinder.of(plugins);

ModuleLayer parent = ModuleLayer.boot();
Configuration parentConfig = parent.configuration();

Configuration config = parentConfig.resolve(
        finder,
        ModuleFinder.of(),
        Set.of("com.example.report.plugins"));
```

Resolution bắt đầu từ root modules và tính graph các dependency/readability cần thiết.

Sau đó config mới được define thành runtime layer:

```java
ModuleLayer layer = parent.defineModulesWithOneLoader(
        config,
        ClassLoader.getSystemClassLoader());
```

Tách `Configuration` và `ModuleLayer` là điểm quan trọng:

```text
Configuration
→ graph đã resolve

ModuleLayer
→ runtime modules + mapping sang ClassLoader
```
