Before Java can call native code, the operating system's loader must be able to find a compatible binary and load it into the process. Search behavior depends on how the library is requested and on the operating system.

For JNI-style loading, `System.loadLibrary("mathbridge")` asks the runtime to load a logical library name. The runtime maps that logical name to a platform-specific file name and searches configured native-library locations. `java.library.path` is one Java-side input to that search, while the OS may also have its own loader paths and dependency rules.

Loading can fail even when the primary file exists. A library may depend on another native library that is missing, built for the wrong architecture, or unavailable in the loader's dependency search path.

When diagnosing a load failure, separate these questions:

1. Did Java resolve the requested library name/path?
2. Did the OS loader accept the binary format and architecture?
3. Were the library's native dependencies available?
4. After loading, does the expected symbol exist?

That separation prevents treating every `UnsatisfiedLinkError` as the same problem.
