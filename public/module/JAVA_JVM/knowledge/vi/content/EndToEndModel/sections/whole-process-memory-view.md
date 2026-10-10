Một JVM production process nên được nhìn như tổng của nhiều memory/resource category:

```text
managed heap
+ thread/native stacks
+ class metadata
+ compiled code/code cache
+ direct/off-heap buffers
+ native libraries/runtime internals
= process footprint
```

Heap tuning chỉ tác động một phần tổng footprint. Thread explosion, classloader leak hoặc native buffer growth có thể gây memory pressure độc lập.

Whole-process view giúp tránh anti-pattern “heap graph ổn nên chắc chắn không có memory problem”.
