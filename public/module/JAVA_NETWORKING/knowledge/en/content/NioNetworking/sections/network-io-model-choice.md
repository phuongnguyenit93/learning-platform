All three models are valid. Start the decision from the required **semantics and control**, rather than from an assumption that "NIO is always faster."

| Model | Good fit | Design cost to accept |
|---|---|---|
| Blocking socket/channel + thread or virtual thread per task | Sequential request/connection flow and readable code; Java 21 virtual threads allow much higher blocking-style concurrency | Still requires resource limits, timeout/cancellation, and bounded downstream load |
| Non-blocking `SelectableChannel` + `Selector` | One/few event-loop threads must multiplex many channels with explicit readiness and pending-buffer/state control | Application manages state machines, partial I/O, interest ops, fairness, and lifecycle |
| `Asynchronous*Channel` | The system composes naturally around completion callbacks/Futures or specifically needs an operation-completion API | Completion state, pending-operation rules, and channel-group lifecycle add complexity |

A practical decision path is:

```text
blocking flow meets the requirements
        ↓
keep the simpler blocking model; consider virtual threads on Java 21

explicit readiness multiplexing is required
        ↓
Selector + non-blocking channels

completion-oriented API is required
        ↓
Asynchronous channels
```

None of these models automatically solves application framing, backpressure policy, admission control, or concurrency correctness. NIO supplies I/O mechanisms; application-level policies remain with their appropriate owners.

After establishing these lower-level I/O models, the next chapter moves up to the JDK HTTP Client to show how a higher-level HTTP abstraction hides most socket/channel mechanics while preserving important completion, timeout, and resource-lifetime concerns.
