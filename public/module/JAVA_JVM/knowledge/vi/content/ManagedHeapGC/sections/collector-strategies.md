Collector khác nhau chủ yếu ở cách tổ chức heap và cách phân chia công việc giữa application threads với GC threads.

Các dimension thường gặp:

- **serial vs parallel**: collection work dùng một hay nhiều GC thread;
- **stop-the-world vs concurrent**: phần nào buộc ứng dụng pause;
- **generational vs non-generational**: có chia object theo age/lifetime assumption hay không;
- **region-based**: heap chia thành region để collection linh hoạt hơn;
- **compacting vs non-compacting**: cách xử lý fragmentation.

Ví dụ Java 21 có nhiều collector với goals khác nhau, và ZGC còn có generational/non-generational mode. Điều đó minh họa rằng “GC của Java” không phải một thuật toán duy nhất.
