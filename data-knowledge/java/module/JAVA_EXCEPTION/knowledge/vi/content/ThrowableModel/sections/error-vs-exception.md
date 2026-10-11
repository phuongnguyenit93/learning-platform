`Error` thường đại diện cho các điều kiện nghiêm trọng liên quan tới JVM, quá trình liên kết lớp (linkage), môi trường chạy hoặc assertion, ví dụ `OutOfMemoryError` hay `NoClassDefFoundError`.

`Exception` thường đại diện cho lỗi mà ứng dụng hoặc API có thể mô hình hóa, xử lý, chuyển đổi hoặc truyền tiếp, ví dụ `IOException`, `IllegalArgumentException` hoặc exception riêng của miền nghiệp vụ.

### VÌ SAO PHẢI PHÂN BIỆT?

Về cú pháp, Java vẫn cho phép:

```java
try {
    run();
} catch (Throwable t) {
    ...
}
```

Nhưng `catch (Throwable)` quá rộng có thể bắt luôn cả `Error`. Ứng dụng khi đó dễ vô tình biến một tình trạng nghiêm trọng của môi trường chạy thành “một lỗi nghiệp vụ bình thường”.

Mô hình cần nhớ:

```text
Exception
→ "ứng dụng có thể có chính sách xử lý lỗi này"

Error
→ "đừng mặc định rằng code ứng dụng có thể phục hồi an toàn"
```

Đây là hướng dẫn thiết kế, không phải lời khẳng định rằng `Error` tuyệt đối không bao giờ được bắt. Một số ranh giới rất đặc biệt có thể cần quan sát hoặc dọn dẹp, nhưng mã nguồn thông thường không nên dùng `catch (Throwable)` như khối xử lý chung.

### Hệ phân cấp quyết định phạm vi của `catch`

Kiểu khai báo trong `catch` xác định một **nhánh của hệ phân cấp** mà khối đó có thể nhận:

```text
catch (Throwable)
→ rất rộng: nhận cả Error lẫn Exception

catch (Exception)
→ nhận Exception và các lớp con của nó
→ không nhận Error

catch (IOException)
→ hẹp hơn: chỉ nhận IOException và các lớp con
```

Vì vậy chọn kiểu `catch` không phải là ghi nhớ tên lớp; đó là chọn **phạm vi lỗi mà tầng hiện tại thực sự có trách nhiệm xử lý**. Bắt quá rộng dễ kéo vào những lỗi mà tầng này không hiểu, còn bắt cụ thể giúp chính sách xử lý rõ hơn.

Chương về sự lan truyền Exception sẽ đi sâu vào cách Java chọn khối `catch` cụ thể khi nhiều khối xử lý cùng xuất hiện.
