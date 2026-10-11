`Future` chủ yếu là handle để:

- kiểm tra completion;
- cancel;
- blocking `get()` result.

`CompletableFuture` thêm completion pipeline/composition:

- transform;
- compose;
- combine;
- race;
- error recovery.

Hai điểm cần nhớ:

```text
Future do ExecutorService.submit(...) trả về
→ future.cancel(true)
→ có thể request interrupt running task

CompletableFuture.cancel(true)
→ mayInterruptIfRunning không điều khiển processing của CompletableFuture implementation
```

`allOf()` / `anyOf()` cũng chỉ aggregate completion. Completion có thể exceptional, và aggregate operation không mặc định là policy tự cancel các sibling future còn lại. Riêng `allOf()` không nên được hiểu như fail-fast barrier: một child fail sớm không có nghĩa aggregate lập tức complete khi các child khác vẫn chưa complete.

Và `join()` không phải non-blocking variant của `get()`: nó vẫn có thể chờ completion; khác biệt nổi bật nằm ở exception API (`CompletionException` unchecked so với `ExecutionException` checked của `get()`).
