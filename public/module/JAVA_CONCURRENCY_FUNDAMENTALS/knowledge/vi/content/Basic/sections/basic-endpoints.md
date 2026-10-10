| README section | Controller method / Demo | Endpoint | Mục đích |
| --- | --- | --- | --- |
| `#process-and-thread` | `BasicThreadController#processAndThread()` | `GET /basic/process-thread` | Quan sát JVM process và HTTP request thread |
| `#start-vs-run` | `BasicThreadController#startVsRun()` | `GET /basic/start-vs-run` | Chứng minh `run()` không tạo thread mới còn `start()` thì có |
| `#thread-state` | `BasicThreadController#threadLifeCycle()` | `GET /basic/thread-life-cycle` | Quan sát sáu giá trị `Thread.State` |
| `#create-thread` | `CreateThreadController#createByExtends()` | `GET /create/extends` | Tạo Thread bằng subclass của `Thread` |
| `#create-thread` | `CreateThreadController#createByRunnable()` | `GET /create/runnable` | Tách task `Runnable` khỏi `Thread` |
| `#create-thread` | `CreateThreadController#createByCallable()` | `GET /create/callable` | Chạy `Callable` bằng `FutureTask` và một Thread trực tiếp |
| `#daemon-thread` | `DaemonThreadController#inspectDaemonRules()` | `GET /daemon/inspect` | Quan sát daemon flag và inheritance |
| `#daemon-thread` | `DaemonJvmExitDemo.main()` | Java application độc lập | Chứng minh JVM không đợi daemon thread |

Sau phần này, cần tự trả lời được các câu hỏi:

1. `Thread`, `Runnable` và `Callable` khác vai trò ở đâu?
2. Vì sao `thread.run()` không tương đương `thread.start()`?
3. `Thread.State.BLOCKED` khác `WAITING` như thế nào?
4. Vì sao một Thread đã `TERMINATED` không thể restart?
5. Vì sao kết thúc HTTP request trong Spring Boot không chứng minh được daemon thread sẽ chết?
6. Vì sao Executor chưa nên được coi đơn giản là "một cách tạo Thread"?
