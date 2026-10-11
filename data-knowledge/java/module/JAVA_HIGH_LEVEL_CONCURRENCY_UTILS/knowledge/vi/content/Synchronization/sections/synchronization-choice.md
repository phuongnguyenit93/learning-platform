```text
state đơn giản / counter
→ Atomic / LongAdder

critical section nhiều bước
→ synchronized hoặc Lock

read-heavy shared structure
→ cân nhắc ReadWriteLock / CopyOnWrite tùy pattern

sorted concurrent map
→ ConcurrentSkipListMap

map concurrent thông thường
→ ConcurrentHashMap

optimistic read chuyên biệt
→ StampedLock nếu complexity đáng giá
```

Không chọn tool chỉ dựa trên câu "cái này nhanh hơn". Correctness trước, sau đó đo contention/workload thật.
