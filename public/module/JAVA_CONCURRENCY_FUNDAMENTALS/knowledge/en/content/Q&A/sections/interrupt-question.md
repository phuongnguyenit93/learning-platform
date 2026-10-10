Nope.

`interrupt()` Send a Cooperative Cancellation Signal.

The running code must:

- check interrupt status; or
- are in an interruptible blocking operation; or
- propagate/restore interruption properly.

A tight loop that doesn't check for interrupts won't stop itself just because the caller calls. `interrupt()`.
