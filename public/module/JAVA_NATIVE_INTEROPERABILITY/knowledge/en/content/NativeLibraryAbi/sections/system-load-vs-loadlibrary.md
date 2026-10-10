`System.load` and `System.loadLibrary` both load native code into the current process, but they express the target differently.

```java
System.load("C:\\app\\native\\bridge.dll");   // concrete file path
System.loadLibrary("bridge");                  // logical library name
```

`System.load(String filename)` requires an **absolute path** to the native library file. It is useful when application code already knows the exact native artifact to load.

`System.loadLibrary(String libname)` accepts a logical library name without a platform file-name prefix/suffix. The runtime maps that name to a platform representation and searches the native-library path. This is usually better when packaging provides one platform-specific implementation under a stable logical name.

Neither API solves ABI compatibility. A file can be found yet still fail to load because it targets a different CPU architecture, or it can load successfully yet expose an unexpected set of symbols.

Keep library selection/deployment separate from function signature correctness. The former gets code into the process; the latter determines whether calls are valid.
