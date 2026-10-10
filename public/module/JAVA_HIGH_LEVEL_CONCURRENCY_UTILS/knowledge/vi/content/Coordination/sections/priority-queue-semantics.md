Priority queue trả phần tử theo ordering của comparator/natural order, nhưng có hai footgun:

```text
equal priority
→ không nên mặc định FIFO

high-priority item tới liên tục
→ low-priority item có thể phải chờ rất lâu
```

Đây là **business scheduling semantics**, không chỉ là implementation detail.

Tham khảo:

```text
CoordinationController#priorityQueueSemantics()
GET /coordination/priority-queue-semantics
```

Experiment tạo một task priority cao và hai task cùng priority. Output trả observed order nhưng đồng thời ghi rõ:

```text
higherPriorityComesFirst = true
equalPriorityFifoIsContract = false
boundedCapacityBackpressure = false
```

**Kết luận:** nếu cần FIFO trong cùng priority, hãy đưa sequence vào ordering rule thay vì dựa vào insertion order ngầm định.
