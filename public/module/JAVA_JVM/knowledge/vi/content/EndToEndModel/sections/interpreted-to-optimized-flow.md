Trong HotSpot, method có thể bắt đầu ở interpreter, thu thập profile rồi được JIT compile khi đủ hot.

```text
cold bytecode
→ interpreted
→ profile
→ compiled
→ optimized
→ assumption invalid?
   └─→ deopt / recompile
```

Đây là lifecycle động, không phải một transition chỉ xảy ra đúng một lần.

Hệ quả: benchmark JVM cần warm-up và measurement discipline; latency của startup/cold path có thể khác steady-state.
