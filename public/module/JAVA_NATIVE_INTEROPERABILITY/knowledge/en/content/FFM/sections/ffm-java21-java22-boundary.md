In this module the baseline is **Java 21**, where FFM is a preview API delivered by JEP 442. Code that uses `java.lang.foreign` preview APIs must be compiled and run with preview features enabled for Java 21.

For example:

```text
javac --release 21 --enable-preview Example.java
java  --enable-preview Example
```

FFM was finalized in Java 22. That release-history milestone belongs to the Java Version curriculum; this module keeps its examples and API assumptions aligned with Java 21 unless a later-version difference is explicitly identified.

Two different controls must not be confused:

```text
--enable-preview
→ allows use of the Java 21 preview API surface

--enable-native-access=...
→ grants native access to the selected modules for restricted operations
```

Preview enablement and native-access control are independent. In Java 21, preview is required to compile/run this FFM API. Native access governs authorization for restricted operations: omitting the option allows calls with warnings, while specifying it grants access only to the listed modules.

When reading later JDK documentation, check signatures carefully because FFM evolved before finalization. Code written for Java 22+ is not automatically valid Java 21 source.
