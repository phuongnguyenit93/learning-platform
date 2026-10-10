A `FunctionDescriptor` models a foreign function signature as zero or more argument layouts plus zero or one return layout.

For a C function:

```c
int add(int left, int right);
```

a corresponding descriptor can be:

```java
FunctionDescriptor ADD = FunctionDescriptor.of(
    ValueLayout.JAVA_INT,
    ValueLayout.JAVA_INT,
    ValueLayout.JAVA_INT
);
```

For `void` return types, use `FunctionDescriptor.ofVoid(...)`.

The descriptor is a binary contract, not a Java reflection signature. Its layouts tell the linker how native arguments and results are represented according to the ABI.

Address parameters use an `AddressLayout` such as `ValueLayout.ADDRESS`. Struct or union values may use group layouts when supported by the native linker.

An incorrect descriptor can create a call handle that compiles on the Java side yet invokes native code with the wrong binary contract, which can lead to process corruption or a crash.
