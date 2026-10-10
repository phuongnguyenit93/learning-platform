A Java agent is privileged in-process code. It can observe runtime classes, alter bytecode, and share the application's security/failure domain.

Control:

- where the artifact comes from;
- checksums/signatures/version pinning;
- who may add -javaagent or attach to the process;
- which configuration/secrets the agent can read;
- which telemetry leaves the process;
- audit records for enablement/dynamic attach.

The java.lang.instrument package specification explicitly places responsibility for verifying agent trustworthiness on those deploying agents/tools.

Practical threat model:

~~~text
malicious/compromised agent
→ arbitrary in-process observation/modification
→ impact comparable to a highly privileged component
~~~

Do not review an agent as if it were a harmless logging library simply because its initial use case is monitoring.
