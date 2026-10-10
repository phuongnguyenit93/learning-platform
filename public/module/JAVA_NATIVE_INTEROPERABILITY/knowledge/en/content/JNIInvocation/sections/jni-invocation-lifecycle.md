Embedding a JVM makes the native application responsible for a managed runtime inside its process. A robust host therefore assigns ownership at every stage.

| Stage | Native host responsibility |
| --- | --- |
| configuration | choose JNI version and VM options |
| startup | create the JVM and handle startup failure |
| Java calls | manage references and pending exceptions |
| native workers | obtain per-thread `JNIEnv*` through attach/GetEnv |
| resources | release JNI and native state at the correct lifetime |
| shutdown | stop work, detach threads, and coordinate VM termination |

Keep two invariants in mind:

1. `JavaVM*` is the VM-level handle; `JNIEnv*` is thread-specific.
2. Java exceptions and fatal native process failures belong to different failure domains.

Treat JVM embedding as a real runtime lifecycle with explicit bootstrap, thread participation, error translation, and cleanup. That is more reliable than viewing the Invocation API as a handful of unrelated C functions.

After completing the JNI model in both directions, the next chapter introduces FFM as a different Java-facing model for foreign memory and C-style function contracts, rather than as a replacement for JVM embedding.
