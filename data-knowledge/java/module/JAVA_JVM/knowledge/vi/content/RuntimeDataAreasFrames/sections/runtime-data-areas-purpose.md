Khi chương trình chạy, JVM cần nơi lưu trạng thái thực thi, object, call stack và dữ liệu trung gian. JVM Specification mô tả các **runtime data areas** ở mức hợp đồng logic để mọi implementation có cùng execution semantics, nhưng không bắt buộc một physical layout duy nhất trong bộ nhớ tiến trình.

Hai câu hỏi nền tảng:

```text
dữ liệu này thuộc toàn JVM?
hay thuộc riêng một thread?
```

và:

```text
vùng này thuộc specification-level model?
hay là implementation-specific memory structure?
```

Nếu không tách hai lớp này, người học rất dễ đồng nhất “method area = metaspace” hoặc “JVM stack = một vùng có layout cố định”, trong khi specification không nói như vậy.
