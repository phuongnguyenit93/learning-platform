JNI reference-lifetime bugs usually fall into two categories: **using a reference after its valid lifetime** and **keeping a reference alive longer than intended**.

A local reference is always tied to its JNI thread and local frame. A local created during a Java → native method call becomes invalid when that native method returns, so storing it in native global state for a later call is incorrect. An Invocation-attached native thread is different: its locals can survive across multiple JNI calls until explicit deletion/frame cleanup or detachment, but they still are not cross-thread references. If the native side must retain a Java object independently of that local frame/thread lifetime, it needs a global reference.

The opposite problem is a leaked global reference. A global reference keeps the Java object reachable until DeleteGlobalRef is called, so forgetting to release it can prevent garbage collection indefinitely.

Long native loops can also accumulate too many local references. DeleteLocalRef or local frames keep that working set bounded.

The practical rule is simple: the JNI reference lifetime should match the lifetime of the Java object relationship it represents—no shorter and no longer.
