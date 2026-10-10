Multiple transformers are **composed by chaining**:

~~~text
input bytes
  ↓ transformer A
bytes A
  ↓ transformer B
bytes B
  ↓ transformer C
final bytes
~~~

The byte[] returned by one transformer becomes classfileBuffer for the next. A transformer therefore does not necessarily see the “original class”; it may see bytes already modified by another agent.

Example:

~~~text
coverage agent
→ injects counters

APM agent
→ receives bytes that already contain counters
→ injects timing spans
~~~

Design consequences:

- avoid depending on exact byte layout unless necessary;
- parsers must tolerate attributes/code added by other tools;
- test agent coexistence;
- preserve semantics outside the transformation's responsibility.

Chaining is one reason bytecode tooling must be robust and version-compatible.
