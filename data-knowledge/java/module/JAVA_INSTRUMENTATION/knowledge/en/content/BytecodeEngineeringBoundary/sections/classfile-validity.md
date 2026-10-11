Resulting class-file bytes must satisfy JVM class-file format and operation-specific constraints.

A bytecode tool often helps compute:

- constant-pool entries;
- instruction encoding;
- branch offsets;
- exception tables;
- stack-map frames;
- attributes.

The agent still owns semantics. A tool may emit a valid call to Helper.record(), but if Helper is not visible to the target class's defining loader/module, verification or linkage can still fail.

Validation should have layers:

~~~text
tool parses/emits
→ isolated verification/load test
→ agent integration test
→ target application smoke test
→ multi-agent / target-JDK compatibility test
~~~

“The bytecode library did not throw” is only the first layer.
