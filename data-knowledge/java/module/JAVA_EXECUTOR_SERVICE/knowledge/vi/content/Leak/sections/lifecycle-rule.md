Mỗi concurrency resource cần trả lời được:

```text
Ai tạo nó?
Ai dừng nó?
Khi nào dừng?
Nếu shutdown timeout thì làm gì?
Task có cooperate với interruption không?
```

Nếu không trả lời được owner/lifecycle, resource leak rất dễ xuất hiện.
