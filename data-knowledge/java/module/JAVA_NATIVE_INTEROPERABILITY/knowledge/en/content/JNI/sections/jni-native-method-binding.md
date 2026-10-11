A Java native method has a Java signature but no Java implementation body:

```java
final class NativeMath {
    static {
        System.loadLibrary("native_math");
    }

    static native int add(int left, int right);
}
```

`javac -h` can generate a JNI C/C++ header. A matching implementation follows JNI naming and parameter conventions:

```c
JNIEXPORT jint JNICALL
Java_com_example_NativeMath_add(
        JNIEnv* env,
        jclass type,
        jint left,
        jint right) {
    return left + right;
}
```

The JVM can resolve native methods through JNI's naming convention, including a long form used when overloaded methods need disambiguation. Native libraries can also bind methods explicitly with `RegisterNatives`.

Library loading and method binding are separate stages. A library may load successfully while the method still fails to link because the expected native implementation is absent or incorrectly declared.
