The class-file format evolves with the JDK. An agent built with an old bytecode library may not understand a newer class-file version or newly introduced attributes.

Useful strategies:

- define and test a supported-JDK matrix;
- update ASM/Byte Buddy when support for newer class-file versions is required;
- avoid stripping attributes that the tool does not understand;
- fail open with null for unsupported classes/versions when the agent is observational only;
- fail fast when instrumentation is a correctness requirement and unsupported versions are unacceptable.

For example:

~~~text
agent compiled on JDK 17
        ≠
automatically safe for every JDK 21/24 class file
~~~

Compatibility includes JVM APIs, class-file versions, and bytecode tooling — not merely the source/target level of the agent JAR.
