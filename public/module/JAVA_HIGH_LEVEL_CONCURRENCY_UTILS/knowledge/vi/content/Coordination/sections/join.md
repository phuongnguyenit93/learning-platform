`join()` là coordination theo lifecycle.

```text
Thread A start worker
        ↓
Thread A gọi worker.join()
        ↓
Thread A chờ
        ↓
worker TERMINATED
        ↓
Thread A tiếp tục
```

Ngoài việc chờ kết thúc, `join()` còn có happens-before guarantee đã học ở phần JMM.

Tham khảo:

```text
CoordinationController#join()
GET /coordination/join
```

**Kết luận:** `join()` phù hợp khi dependency là "tôi chỉ tiếp tục sau khi Thread này hoàn thành".
