Một cách viết cần tránh thường gặp:

```text
repository bắt → log → ném lại
service bắt    → log → ném lại
controller bắt → log → trả kết quả
```

Một lỗi có thể tạo ra ba bản ghi stack trace gần giống nhau.

### Quy tắc kinh nghiệm hữu ích

```text
tầng chỉ ném lại/chuyển đổi
→ giữ ngữ cảnh/cause
→ thường không log lại

tầng kết thúc yêu cầu/tác vụ/thông điệp
→ có đầy đủ ngữ cảnh của yêu cầu, tác vụ hoặc nghiệp vụ
→ thường log một lần
```

Đây không phải luật tuyệt đối. Một tầng có thể cần số liệu đo lường (metric) hoặc bản ghi kiểm toán (audit) riêng mà không ghi lại toàn bộ stack trace.

Câu hỏi tốt hơn “có log không?” là:

```text
Log này thêm thông tin mới gì
và ai chịu trách nhiệm cuối cho lỗi?
```

### Đừng ghi log rồi làm mất cause

Sai:

```java
catch (SQLException ex) {
    log.error("database failed");
    throw new OrderRepositoryException("load failed");
}
```

Tốt hơn nếu cần bọc exception:

```java
catch (SQLException ex) {
    throw new OrderRepositoryException("load failed", ex);
}
```

Ranh giới cuối ghi log lớp bọc cùng chuỗi nguyên nhân một lần.
