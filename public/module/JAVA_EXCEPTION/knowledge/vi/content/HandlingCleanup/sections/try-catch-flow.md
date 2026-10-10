Ví dụ:

```java
try {
    load();
    process();
} catch (IOException ex) {
    recover(ex);
}
```

Nếu `load()` thành công:

```text
load
→ process
→ bỏ qua catch
→ tiếp tục sau try/catch
```

Nếu `load()` ném `IOException`:

```text
load
→ throw
→ process không chạy
→ tìm catch tương thích
→ recover
→ tiếp tục sau try/catch nếu catch hoàn thành bình thường
```

Nếu exception không khớp `catch`, nó tiếp tục lan truyền lên trên.

### Bắt Exception không đồng nghĩa với phục hồi

Đây là một nhầm lẫn phổ biến:

```java
catch (Exception ex) {
    System.out.println("error");
}
```

Việc “đã bắt được exception” chỉ có nghĩa quá trình lan truyền bị chặn ở đó. Nó **không tự động làm hệ thống trở lại trạng thái hợp lệ**.

Khối `catch` nên có một trách nhiệm có ý nghĩa, ví dụ:

- phục hồi bằng phương án thay thế;
- chuyển đổi exception sang mức trừu tượng phù hợp;
- bổ sung ngữ cảnh rồi ném lại;
- kết thúc thao tác có chủ ý;
- tại ranh giới cuối, ghi nhận/ghi log lỗi.

Nếu không có việc hợp lý để làm, để exception tiếp tục lan truyền thường tốt hơn bắt rồi nuốt lỗi.

### Khối `catch` càng rộng càng cần lý do rõ

`catch (Exception ex)` không luôn sai. Nó có thể hợp lý ở một ranh giới của ứng dụng cần chuyển mọi lỗi ứng dụng thành một kết quả thống nhất.

Nhưng ở tầng giữa, catch quá rộng dễ:

- bắt cả lỗi mà tầng này không hiểu;
- vô tình che bug;
- làm mất chính sách xử lý riêng theo kiểu exception;
- khiến ý nghĩa thành công/thất bại trở nên mơ hồ.
