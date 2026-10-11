Precise rethrow giải quyết một tình huống tinh tế: ta bắt bằng một kiểu rộng để làm một việc chung, nhưng trình biên dịch vẫn có thể suy luận các checked exception cụ thể thực sự đi vào `catch`.

Ví dụ:

```java
void process() throws IOException, SQLException {
    try {
        readFileOrQueryDatabase();
    } catch (Exception ex) {
        audit(ex);
        throw ex;
    }
}
```

Giả sử mã nguồn trong `try` chỉ có thể ném `IOException` hoặc `SQLException`. Nếu biến `ex` không bị gán lại, trình biên dịch có thể suy luận việc ném lại chỉ thuộc các kiểu checked đó.

Ta **không bắt buộc** phải đổi phần khai báo thành:

```java
throws Exception
```

### VÌ SAO?

Không có precise rethrow, việc bắt một kiểu cha (supertype) để dùng logic chung có thể làm hợp đồng bị rộng không cần thiết.

Mô hình cần nhớ:

```text
tham số `catch` được khai báo rộng
        ↓
trình biên dịch phân tích những kiểu checked thực sự có thể tới `catch`
        ↓
ex không bị thay thế bằng giá trị khác
        ↓
việc ném lại vẫn giữ được tập kiểu hẹp
```

Multi-catch:

```java
catch (IOException | SQLException ex) {
    throw ex;
}
```

cũng giữ tập kiểu rõ ràng, nhưng đó là **multi-catch**. Precise rethrow đáng chú ý nhất khi tham số được khai báo bằng một kiểu cha (supertype) rộng hơn như `Exception` mà trình biên dịch vẫn suy luận được tập checked exception cụ thể.
