```text
đợi Thread kết thúc
→ join

đợi predicate trên monitor
→ wait/notifyAll

đợi predicate với explicit Lock
→ Condition

park/unpark Thread cụ thể
→ LockSupport

buffer producer-consumer
→ BlockingQueue

đợi N việc hoàn thành
→ CountDownLatch

N Thread gặp nhau tại checkpoint lặp lại
→ CyclicBarrier

giới hạn concurrent permits
→ Semaphore

workflow nhiều phase/dynamic parties
→ Phaser

hai Thread trao đổi object
→ Exchanger
```
