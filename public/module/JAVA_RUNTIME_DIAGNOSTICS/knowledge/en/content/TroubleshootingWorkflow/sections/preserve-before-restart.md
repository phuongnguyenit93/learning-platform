A restart is a recovery action, not a diagnostic conclusion. When operational constraints allow, ask before restarting:

1. Will important thread or JFR state disappear?
2. Is a heap dump or NMT diff needed?
3. Have fatal/core artifacts been copied from ephemeral storage?
4. Could log rotation remove the relevant interval?
5. Have the old PID/container identity and runtime flags been recorded?

A compact checklist helps:

~~~text
[ ] timestamp + PID/container
[ ] thread evidence
[ ] JFR dump
[ ] memory evidence when relevant
[ ] logs + JVM flags/version
[ ] crash artifacts when present
[ ] copy to persistent storage
~~~

Do not insist on collecting everything during a critical outage. Balance service objectives against the uniqueness and value of the evidence.
