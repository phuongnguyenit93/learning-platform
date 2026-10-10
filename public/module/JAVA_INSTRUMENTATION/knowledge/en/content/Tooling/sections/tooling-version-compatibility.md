Tooling versions must keep pace with the target application's class-file versions.

A useful test matrix includes:

~~~text
agent build JDK
× runtime JDK
× application compiler/class-file version
× bytecode tool version
× important framework versions
~~~

An older ASM release may reject a new class-file version; an older Byte Buddy release may not support a newer feature/attribute. Conversely, building an agent on JDK 24 APIs can prevent it from running on a JDK 21 baseline.

Good practice:

- publish the supported JDK range;
- run representative applications on each range in CI;
- pin tool versions;
- upgrade tooling alongside JDK adoption;
- define clear behavior for unknown class-file versions: skip or fail.
