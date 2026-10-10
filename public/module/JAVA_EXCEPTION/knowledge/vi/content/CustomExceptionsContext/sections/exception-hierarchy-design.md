Một cây phân cấp nhỏ có thể cho bên gọi nhiều mức xử lý:

```text
OrderException
├── OrderNotFoundException
└── OrderValidationException
```

Bên gọi muốn xử lý tất cả lỗi order:

```java
catch (OrderException ex) {
    handleOrderFailure(ex);
}
```

Bên gọi muốn chính sách riêng:

```java
catch (OrderNotFoundException ex) {
    showNotFound(ex);
}
```

### Cây phân cấp nên phản ánh chính sách xử lý

Đừng phản chiếu mọi lớp nội bộ:

```text
JdbcOrderTableReadException
JdbcOrderColumnMappingException
JdbcOrderConnectionAcquireException
...
```

nếu bên gọi chỉ có một chính sách:

```text
"không load được order"
```

Một cây phân cấp tốt thường trả lời:

```text
Bên gọi có cần phân biệt hai lỗi này để hành động khác nhau không?
```

Nếu không, hai kiểu riêng có thể là thiết kế thừa.

### Constructor nên phục vụ chuỗi nguyên nhân

Một lớp exception gốc thường cần các constructor phù hợp với cách module sử dụng:

```java
OrderException(String message) {
    super(message);
}

OrderException(String message, Throwable cause) {
    super(message, cause);
}
```

Không bắt buộc phải sao chép mọi constructor của `RuntimeException`; chỉ công khai hợp đồng thực sự cần.

### GHI NHỚ

```text
kiểu tùy chỉnh
→ bổ sung hợp đồng ngữ nghĩa

trường dữ liệu ngữ cảnh
→ dữ liệu có cấu trúc

cause
→ giữ thông tin chẩn đoán từ nguyên nhân gốc

cây phân cấp
→ phục vụ cách bên gọi muốn xử lý
```

Chương tiếp theo tập trung vào ranh giới xử lý trong ứng dụng: bắt ở đâu, khi nào chuyển đổi, ghi log, thử lại, phục hồi hoặc để exception tiếp tục lan truyền?
