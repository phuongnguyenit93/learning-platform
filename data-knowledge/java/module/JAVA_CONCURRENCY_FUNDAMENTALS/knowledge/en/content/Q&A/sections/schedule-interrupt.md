Nope.

The scheduler waits for the deadline using an internal scheduling/condition mechanism and then brings the task to an executable state.

`interrupt()` is the cancellation/interruption signal for the Thread/task that is running or interruptible waiting.

The two concepts are related to "wake/wait" but the semantics are different.
