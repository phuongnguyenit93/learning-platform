| README section | Controller method / Demo | Endpoint | Purpose |
| --- | --- | --- | --- |
| `#process-and-thread` | `BasicThreadController#processAndThread()` | `GET /basic/process-thread` | Observe JVM processes and HTTP request threads |
| `#start-vs-run` | `BasicThreadController#startVsRun()` | `GET /basic/start-vs-run` | Proof `run()` No new threads are created `start()` Yes |
| `#thread-state` | `BasicThreadController#threadLifeCycle()` | `GET /basic/thread-life-cycle` | Observe the Six Values `Thread.State` |
| `#create-thread` | `CreateThreadController#createByExtends()` | `GET /create/extends` | Create a Thread using the subclass of `Thread` |
| `#create-thread` | `CreateThreadController#createByRunnable()` | `GET /create/runnable` | Separate tasks `Runnable` from `Thread` |
| `#create-thread` | `CreateThreadController#createByCallable()` | `GET /create/callable` | Running `Callable` by `FutureTask` and a Live Thread |
| `#daemon-thread` | `DaemonThreadController#inspectDaemonRules()` | `GET /daemon/inspect` | Observing the daemon flag and inheritance |
| `#daemon-thread` | `DaemonJvmExitDemo.main()` | Standalone Java Application | Proving JVM doesn't wait for daemon threads |

After this section, it is necessary to answer the questions yourself:

1. `Thread`, `Runnable` and `Callable` Where are the different roles?
2. Why `thread.run()` not equivalent `thread.start()`?
3. `Thread.State.BLOCKED` Others `WAITING` How?
4. Why a Thread Was `TERMINATED` Can't restart?
5. Why doesn't ending an HTTP request in Spring Boot prove that the thread daemon is dead?
6. Why shouldn't Executor be considered simply "a way to create threads"?
