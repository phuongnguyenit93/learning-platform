Worker trong pool có thể sống rất lâu và chạy nhiều task.

Nếu task làm:

```java
context.set(value);
```

nhưng không cleanup, task sau chạy trên cùng worker có thể gặp stale context hoặc giữ reference lâu hơn cần thiết.

Pattern an toàn:

```java
context.set(value);
try {
    task.run();
} finally {
    context.remove();
}
```

Đây là lý do context propagation wrapper / Spring `TaskDecorator` luôn cần bước restore + cleanup.
