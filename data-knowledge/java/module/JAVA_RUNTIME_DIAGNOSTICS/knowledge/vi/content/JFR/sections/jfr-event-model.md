JFR ghi **event**, không phải một “log text” thống nhất. Mỗi loại event mô tả một dạng hành vi: CPU sample, allocation, GC phase, file/socket I/O, monitor enter, thread park, exception, virtual-thread event...

Event thường có:

- timestamp;
- thời lượng hoặc thời điểm tức thời;
- thread liên quan;
- fields chuyên biệt;
- stack trace nếu cấu hình bật.

Không nên bật mọi event chỉ vì “có thể cần”. Hãy xuất phát từ giả thuyết:

~~~text
high CPU
→ execution / CPU sample events

lock contention
→ monitor/park/thread events

memory growth
→ bằng chứng allocation / GC / old-object

I/O latency
→ socket/file events
~~~

Với virtual threads trong Java 21:

- `jdk.VirtualThreadPinned` mặc định được bật với threshold 20 ms;
- `jdk.VirtualThreadSubmitFailed` mặc định được bật;
- `jdk.VirtualThreadStart` và `jdk.VirtualThreadEnd` mặc định tắt và cần được bật khi thực sự cần quan sát vòng đời.
