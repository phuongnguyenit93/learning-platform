Không nên suy luận như vậy.

`@Async` dispatch invocation qua Spring async infrastructure và executor được resolve cho method/application.

Application phải bật async method execution infrastructure, ví dụ bằng `@EnableAsync` trong configuration tương ứng. Với `void @Async`, caller không có Future để nhận failure; cần `AsyncUncaughtExceptionHandler`/logging/metrics hoặc channel riêng nếu failure quan trọng.

Nếu dùng `ThreadPoolTaskExecutor`, worker được pool quản lý/reuse.

Nếu execution strategy dùng virtual-thread-per-task, behavior lại khác.

Hãy xem executor thực tế thay vì coi annotation là execution mechanism duy nhất.
