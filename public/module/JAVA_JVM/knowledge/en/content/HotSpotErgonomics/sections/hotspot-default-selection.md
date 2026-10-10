HotSpot can choose defaults for the garbage collector, initial/maximum heap sizing, and runtime compiler policy using environment and JVM-version rules.

Java 21 documentation describes defaults in terms of server-class machines and resource heuristics. These values are **version/platform-specific implementation behavior**, not JVM Specification guarantees.

For example, the Java 21 HotSpot tuning guide describes G1 as the default collector on server-class machines, Serial GC for other configurations, and tiered compilation using C1 and C2 as the default compiler policy. These are useful examples of ergonomics selecting runtime policy, not permanent rules for every future JDK.

For production reasoning, record:

```text
JDK vendor/version
host/container resources
explicit VM flags
effective defaults
```

instead of relying on a statement such as “the JVM always defaults to X.”

Upgrading the JDK can change defaults and heuristics even when application code is unchanged.

To inspect effective HotSpot flags on the exact runtime you are using, a practical observation is:

```text
java -XX:+PrintFlagsFinal -version
```

Treat that output as evidence about the **current runtime**, not as part of the JVM specification.
