An Instrumentation learner does not need to become a deep bytecode engineer before writing an agent. The useful level is:

**Know**

- class files contain methods/code/attributes;
- transformers consume and return byte[];
- method bodies have control flow plus operand-stack/local-variable rules;
- verification/linkage happens after transformation;
- class-file versions/attributes evolve with the JDK;
- tooling abstractions have trade-offs.

**Hand off to JVM / bytecode-specialist curriculum**

- detailed constant-pool binary layout;
- deep verifier algorithms;
- every opcode semantic;
- custom optimizer/compiler-backend design.

The goal is enough depth to review transformation risk and debug agent failures, not to write an assembler from scratch.
