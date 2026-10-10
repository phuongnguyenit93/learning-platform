Some FFM operations are classified as **restricted** because incorrect use can bypass the API's normal safety model and cause JVM crashes or silent memory corruption. Java 21 marks such methods explicitly in the API documentation.

Restricted operations are governed by **native access**, which is separate from the fact that FFM itself is a Java 21 preview API.

For a named module:

```text
java --enable-preview \
     --enable-native-access=com.example.nativebridge \
     ...
```

For class-path code, `ALL-UNNAMED` is the relevant target:

```text
java --enable-preview \
     --enable-native-access=ALL-UNNAMED \
     ...
```

In Java 21, when the option is omitted, restricted calls are still allowed but emit runtime warnings. If `--enable-native-access` is specified, native access is granted only to the modules listed by that option; a restricted call from a caller without native access is rejected with `IllegalCallerException`. Granting native access to the calling named module, or to `ALL-UNNAMED` for class-path code, suppresses warnings for that authorized caller. This native-access policy is independent from the hard Java 21 requirement to enable preview features before FFM code can compile and run.

Treat restricted methods as an escalation point. Prefer ordinary bounded segments, layouts, arenas, and linker operations when they can represent the native contract without weakening safety guarantees.

The FFM overview now splits into its core responsibilities. The next chapter starts with MemorySegment, because Java first needs a bounded representation of a memory region before lifetime, layout, and foreign-call mechanics can be reasoned about precisely.
