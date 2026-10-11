Compatibility testing is multi-dimensional:

~~~text
runtime JDK
× application/framework version
× class-file version
× bytecode tool version
× agent configuration
× coexistence with other agents
~~~

A minimum suite should cover:

- startup agent;
- dynamic attach when supported;
- target class loaded before/after agent;
- repeated retransformation;
- disable/rollback;
- multiple class loaders;
- named modules;
- unsupported/unmodifiable class;
- exceptional exit from transformed methods;
- multiple-agent ordering.

A production agent should expose self-diagnostics:

- agent version;
- enabled instrumentations;
- transform success/failure counts;
- skipped unsupported classes;
- current JDK/tool version.

The more transparent the agent is supposed to be to application code, the more important its own diagnostics become.
