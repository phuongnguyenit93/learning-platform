SPI là boundary mà nhiều artifact có thể compile độc lập, nên thay đổi contract phải thận trọng hơn internal API.

Một thay đổi tưởng nhỏ như thêm abstract method mới có thể làm provider cũ không còn tương thích binary/source theo cách mong muốn.

Một số nguyên tắc thiết kế:

- giữ contract module nhỏ và ít dependency;
- tránh expose implementation-specific type;
- dùng default method khi semantics thực sự có default hợp lý;
- ưu tiên thêm capability theo cách provider cũ có thể tiếp tục hoạt động;
- document rõ behavior của `null`, exception, concurrency và resource ownership;
- không để host cast provider sang implementation class.

Ví dụ host không nên làm:

```java
if (exporter instanceof PdfExporter pdf) {
    pdf.enableInternalFeature();
}
```

Nếu capability đó là một phần của contract, hãy model nó trong SPI. Nếu không, host đang phá abstraction boundary.

Version compatibility sẽ được đào sâu ở chapter riêng; ở đây điều cần giữ lại là: **SPI là public compatibility surface giữa host và extension**.

Khi contract đã ổn định, câu hỏi tiếp theo không còn là “provider implement gì?” mà là **host tìm provider đó ở runtime như thế nào**. Vì vậy chapter tiếp theo chuyển từ thiết kế SPI sang `ServiceLoader` và discovery semantics.
