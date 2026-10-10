Service type nên mô tả **capability mà host cần**, không mô tả cấu trúc nội bộ của provider.

Để minh họa một contract giàu semantics hơn baseline ở chapter trước, biến thể sau cố ý thêm capability check, domain type và error contract:

```java
public interface ReportExporter {
    String format();
    boolean supports(Report report);
    void export(Report report) throws ExportException;
}
```

Ở đây host có đủ thông tin để:

1. xác định format/capability;
2. hỏi provider có xử lý request hay không;
3. gọi operation chính;
4. xử lý lỗi ở mức contract.

Một service type nên nhỏ nhưng không đến mức host phải inspect implementation bằng Reflection để biết provider làm được gì. Nếu selection cần metadata quan trọng, hãy cân nhắc biểu diễn metadata đó qua method ổn định của service hoặc annotation rõ ràng.

Tránh để SPI phụ thuộc vào type nội bộ của host:

```java
// Coupling mạnh: provider phải biết internal class của host
void export(InternalReportEntity entity);
```

Ưu tiên DTO/value type nằm trong contract module và có semantics ổn định.
