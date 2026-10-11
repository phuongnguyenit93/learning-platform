Một mục tiêu cốt lõi của service-provider architecture là host phụ thuộc vào **service contract**, không phụ thuộc provider modules.

Host module nên có dạng:

```java
module com.example.report.host {
    requires com.example.export.api;
    uses com.example.export.ReportExporter;
}
```

không phải:

```java
module com.example.report.host {
    requires com.example.export.api;
    requires com.example.export.pdf;
    requires com.example.export.csv;
}
```

Nếu host `requires` mọi provider, extension set lại trở thành compile-time dependency list và mất phần lớn lợi ích decoupling.

Provider modules nên được đưa vào runtime image/module path hoặc dynamic configuration theo deployment architecture. Host chỉ cần biết contract và selection policy.

Test cũng nên phản ánh boundary này: contract test verify mỗi provider độc lập; integration test verify host discover provider từ artifact/deployment thực tế mà không import concrete class.

Đến đây Java đã giải quyết được **contract + registration + discovery boundary**, nhưng vẫn chưa trả lời ai sở hữu validation, selection registry, lifecycle, failure containment và cleanup. Những trách nhiệm đó là lý do chapter tiếp theo nâng mô hình từ ServiceLoader provider thành **plugin architecture**.
