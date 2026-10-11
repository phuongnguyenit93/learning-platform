Choose the mechanism by starting from the real native contract, not from API preference.

Useful questions include:

1. Is the native surface a straightforward C function API, or does it interact deeply with Java objects and classes?
2. Is there already a tested and maintained JNI wrapper?
3. Can the application's JDK baseline accept Java 21 preview FFM?
4. How complicated are callbacks, pointer ownership, and resource lifetimes?
5. Which OS and CPU architectures must be supported?
6. Can the team diagnose native crashes, ABI mismatches, and packaging failures?

A good binding should also expose a small Java-facing API so that ordinary callers do not need to know about JNIEnv, raw symbol names, or native lifetime details.
