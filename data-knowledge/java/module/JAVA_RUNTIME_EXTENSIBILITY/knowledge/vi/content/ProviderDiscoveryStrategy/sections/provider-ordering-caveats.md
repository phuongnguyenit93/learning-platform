`findFirst()` trả provider đầu tiên mà loader traversal cung cấp. Nó không biến thứ tự discovery thành một global priority contract.

Java có một số ordering rule cục bộ, ví dụ provider trong cùng module descriptor giữ declaration order hoặc class-path service file giữ thứ tự resource/class-name tương ứng. Nhưng thứ tự giữa các module trong cùng layer/class loader không phải business order tổng quát mà ứng dụng nên dựa vào.

Do đó code kiểu này có thể quá yếu:

```java
ReportExporter exporter =
        ServiceLoader.load(ReportExporter.class)
                .findFirst()
                .orElseThrow();
```

nếu có nhiều provider cùng service nhưng khác quality/capability.

Tốt hơn:

```text
discover candidates
→ validate compatibility
→ filter capability
→ apply explicit priority/tie-breaker
→ select
```

`findFirst()` phù hợp khi contract thực sự nói “bất kỳ provider hợp lệ nào cũng được”, hoặc sau khi pipeline đã sắp xếp/filter theo policy của host.
