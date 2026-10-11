# Thread Pool & Executor trong Java

Sau khi hiểu Thread trực tiếp, coordination và synchronization, phần này chuyển sang abstraction quản lý **nhiều task trên một tập worker Thread**.

```text
Task
→ Executor
→ worker threads + queue + lifecycle + rejection policy
```
