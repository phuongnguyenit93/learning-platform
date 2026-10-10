| README section | Controller method | Endpoint | Mục đích |
| --- | --- | --- | --- |
| `#interrupt-mental-model` | `InterruptionController#interruptBusyWorker()` | `GET /interruption/busy-loop` | Chứng minh cooperative cancellation của CPU loop |
| `#interrupt-flag` | `InterruptionController#inspectInterruptFlag()` | `GET /interruption/flag` | Phân biệt `isInterrupted()` và `Thread.interrupted()` |
| `#interrupted-exception` | `InterruptionController#interruptSleepingWorker()` | `GET /interruption/sleep` | Quan sát `InterruptedException`, flag clear và restore |
| `#interrupt-cleanup` | `InterruptionController#cancelWithCleanup()` | `GET /interruption/cleanup` | Chứng minh cleanup trong cancellation path |
| `#interrupt-limitations` | `InterruptionController#interruptSynchronizedWaiter()` | `GET /interruption/synchronized-blocked` | Chứng minh `synchronized` monitor acquisition không interruptible |
| `#interrupt-vs-stop-flag` | `InterruptionController#stopFlagVsInterrupt()` | `GET /interruption/stop-flag-vs-interrupt` | So sánh stop flag với interruption khi worker đang block |

Sau phần này cần tự trả lời được:

1. Vì sao `interrupt()` không đồng nghĩa với kill Thread?
2. Busy loop phải làm gì để phản ứng với cancellation?
3. `isInterrupted()` và `Thread.interrupted()` khác nhau ở đâu?
4. Vì sao interrupt flag có thể là `false` bên trong `catch (InterruptedException)`?
5. Khi nào nên restore interrupt status?
6. Vì sao cleanup nên nằm trong `finally`?
7. Vì sao một Thread đang `BLOCKED` chờ `synchronized` vẫn không thoát ngay sau `interrupt()`?
8. Vì sao `volatile boolean stop = true` không thể tự đánh thức một Thread đang `sleep()`?
