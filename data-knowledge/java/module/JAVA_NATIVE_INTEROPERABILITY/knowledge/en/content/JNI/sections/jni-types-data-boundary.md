JNI maps Java primitive values to JNI-defined native types such as `jint`, `jlong`, and `jdouble`. Object-like Java values cross the boundary as JNI reference types such as `jobject`, `jclass`, `jstring`, and array references.

These references are handles governed by JNI rules. A `jstring` is not simply a permanent `char*`, and a Java array is not guaranteed to be a stable native array pointer.

JNI therefore provides explicit access operations:

```text
jstring
  → GetStringUTFChars
  → use borrowed/native view
  → ReleaseStringUTFChars

jintArray — elements path
  → GetIntArrayElements
  → process borrowed/copied elements
  → ReleaseIntArrayElements

jintArray — region path
  → GetIntArrayRegion into caller-owned buffer
  → process copied region
  → no ReleaseIntArrayElements for that region buffer
```

Some access methods may copy; others may expose or pin VM-managed storage depending on the operation and implementation. Use the matching lifetime contract for the operation: element access has a corresponding release, while region access copies into the caller's buffer.

Think in terms of **managed access with a defined lifetime**, not “JNI gave native code ownership of a Java object's memory.”
