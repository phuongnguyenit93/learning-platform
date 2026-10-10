An agent executes in the same JVM and may alter application class bytecode. The package specification therefore places responsibility for verifying an agent's trustworthiness on those deploying the agent or the tool that loads it.

Typical risks include:

- an agent JAR replaced or obtained from an untrusted source;
- a transformer accidentally targeting JDK/framework classes;
- helper classes being loaded by an unexpected loader;
- an agent reading sensitive process data;
- invalid bytecode breaking application startup or execution;
- dynamic attach creating a runtime modification path outside normal deployment controls.

The security mental model is simple: **an agent has highly privileged in-process reach**. Provenance, version pinning, attach controls, audit logging, and rollback planning matter as much as transformer correctness.
