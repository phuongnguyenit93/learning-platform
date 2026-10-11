| README section | Controller method | Endpoint | Purpose |
| --- | --- | --- | --- |
| `#interrupt-mental-model` | `InterruptionController#interruptBusyWorker()` | `GET /interruption/busy-loop` | Proof of cooperative cancellation of CPU loop |
| `#interrupt-flag` | `InterruptionController#inspectInterruptFlag()` | `GET /interruption/flag` | Differentiation `isInterrupted()` and `Thread.interrupted()` |
| `#interrupted-exception` | `InterruptionController#interruptSleepingWorker()` | `GET /interruption/sleep` | Observation `InterruptedException`, flag clear and restore |
| `#interrupt-cleanup` | `InterruptionController#cancelWithCleanup()` | `GET /interruption/cleanup` | Proof of cleanup in the cancellation path |
| `#interrupt-limitations` | `InterruptionController#interruptSynchronizedWaiter()` | `GET /interruption/synchronized-blocked` | Proof `synchronized` Non-Interruptible Monitor Acquisition |
| `#interrupt-vs-stop-flag` | `InterruptionController#stopFlagVsInterrupt()` | `GET /interruption/stop-flag-vs-interrupt` | Comparing stop flags to interruptions when workers are blocking |

After this part, you need to be able to answer yourself:

1. Why `interrupt()` is not synonymous with killing Thread?
2. What does a busy loop have to do in response to a cancellation?
3. `isInterrupted()` and `Thread.interrupted()` Where is the difference?
4. Why an interrupt flag can be `false` Inside `catch (InterruptedException)`?
5. When should I restore interrupt status?
6. Why cleanup should be in `finally`?
7. Why a Thread is `BLOCKED` standby `synchronized` still doesn't escape immediately after `interrupt()`?
8. Why `Volatile Boolean Stop = True` can't wake up a Thread by itself `sleep()`?
