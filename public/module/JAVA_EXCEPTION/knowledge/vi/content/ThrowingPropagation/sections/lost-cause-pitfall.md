Cách viết cần tránh:

```java
catch (SQLException ex) {
    throw new RuntimeException("load failed");
}
```

Exception mới không biết `SQLException` cũ là nguyên nhân.

Hệ quả:

```text
log
→ chỉ thấy lớp bọc

stack trace gốc
→ mất khỏi chuỗi nguyên nhân

chẩn đoán
→ khó biết lỗi cơ sở dữ liệu nằm ở đâu
```

Cách đúng khi tạo exception mới từ exception cũ:

```java
catch (SQLException ex) {
    throw new RuntimeException("load failed", ex);
}
```

Phần này chỉ tập trung vào việc **không làm mất cause**. Quyết định ném lại exception cũ hay bọc bằng exception mới sẽ được xử lý ở chương về ranh giới ứng dụng.

### GHI NHỚ PHẦN CỐT LÕI

```text
throw
→ bắt đầu luồng xử lý bất thường

lan truyền (propagation)
→ lỗi đi lên ngăn xếp lời gọi

stack unwinding
→ các khung ngăn xếp được rời bỏ, công việc dọn dẹp liên quan vẫn phải chạy

catch
→ chặn lan truyền tại tầng có trách nhiệm

lớp bọc mới + cause
→ tạo exception mới nhưng vẫn giữ nguyên nhân gốc
```

Các phần còn lại của chương là lớp kiến thức nâng cao về checked exception: precise rethrow và quy tắc `throws` khi ghi đè. Người học có thể quay lại các phần này sau khi đã nắm chắc luồng lan truyền, cách chọn `catch` và chuỗi nguyên nhân.
