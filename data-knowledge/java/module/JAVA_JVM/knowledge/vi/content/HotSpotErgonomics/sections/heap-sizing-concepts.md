Heap sizing đặt giới hạn cho lượng bộ nhớ mà managed heap có thể sử dụng. Với Java 21 launcher, `-Xms` đặt **minimum và initial heap size**, còn `-Xmx` đặt **maximum heap size**.

Đánh đổi:

- heap quá nhỏ → collection thường xuyên, allocation pressure;
- heap lớn hơn → nhiều headroom, nhưng mức chiếm dụng bộ nhớ tăng và một số hành vi/pause của collector có thể thay đổi;
- `-Xmx` chỉ giới hạn heap, **không giới hạn toàn bộ bộ nhớ tiến trình**.

Trong container, cần nghĩ:

```text
container limit
> heap
+ thread stacks
+ metaspace/class metadata
+ code cache
+ direct/native memory
+ native libraries
```

Không nên cấp gần như toàn bộ giới hạn bộ nhớ container cho heap, vì JVM process còn cần stack, metadata, code cache và native memory khác.
