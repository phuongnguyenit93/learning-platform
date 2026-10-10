Native interoperability makes deployment part of correctness.

An application may need to manage:

- a native artifact for each supported OS and CPU architecture;
- transitive native dependencies;
- search and load paths;
- symbol and library-version compatibility;
- JDK/runtime options such as --enable-preview and native-access declarations for Java 21 FFM.

Portability is no longer just “ship one JAR everywhere.” The Java layer can remain portable while the native binary must be built and packaged separately for each target.

Version constraints should also be separated: JDK version, JNI/FFM API version, native header version, and binary library version are different contracts. The test matrix should cover the combinations that are actually supported rather than only the developer's machine.
