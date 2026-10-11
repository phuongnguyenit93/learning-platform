Phù hợp để thử khi:

- rất nhiều concurrent request/task;
- task chủ yếu chờ I/O;
- muốn giữ imperative/thread-per-task style;
- downstream capacity đã được giới hạn hợp lý.

Không mặc định là lựa chọn tốt nhất khi:

- workload CPU-bound thuần túy;
- concurrency thực sự thấp;
- bottleneck nằm hoàn toàn ở downstream có capacity nhỏ;
- code giữ monitor/pinned blocking lâu trên Java version đang dùng.
