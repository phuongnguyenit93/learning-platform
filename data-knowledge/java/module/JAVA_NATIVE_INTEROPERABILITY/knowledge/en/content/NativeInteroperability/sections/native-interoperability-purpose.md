Pure Java is usually the simplest and most portable option, but some useful capabilities already exist outside the Java platform. Reimplementing them can be expensive, impossible, or undesirable.

Native interoperability matters when Java must reuse an existing native investment or reach a capability exposed through a native ABI. Examples include mature C libraries, system APIs, codecs, database engines, scientific libraries, hardware SDKs, or memory shared with another runtime.

Without an interoperability mechanism, Java code would have no standard way to answer questions such as:

- which native library should be loaded?
- which symbol represents the function we want?
- what binary signature does that function expect?
- how is a native structure laid out in memory?
- who owns allocated memory and when is it released?
- how does native code call back into Java?

JNI and FFM solve these questions at different abstraction levels. JNI is the long-standing JVM/native interface centered on native methods and the JNI function table. FFM gives Java APIs for foreign functions and foreign memory, with explicit models for segments, layouts, arenas, linkers, and symbols.

Native interoperability therefore exists because the Java ecosystem sometimes has to participate in contracts that are defined outside the Java object model.
