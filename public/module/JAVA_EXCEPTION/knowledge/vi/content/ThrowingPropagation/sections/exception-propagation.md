Dùng lại câu chuyện của module:

```text
controller()
   ↓
service()
   ↓
repository()
   ↓
throw IOException
```

Ví dụ:

```java
void controller() throws IOException {
    service();
}

void service() throws IOException {
    repository();
}

void repository() throws IOException {
    throw new IOException("cannot read order");
}
```

Không phương thức nào bắt exception, nên luồng là:

```text
repository()
→ dừng tại throw
→ rời khung ngăn xếp của repository()

service()
→ không tiếp tục sau repository()
→ rời khung ngăn xếp của service()

controller()
→ exception tiếp tục truyền lên bên gọi của controller()
```

Quá trình lần lượt rời từng khung ngăn xếp (stack frame) như vậy là **stack unwinding**.

### Điều gì xảy ra trong lúc unwind?

Khi exception xuất hiện, Java trước hết tìm một khối `catch` phù hợp trong các cấu trúc `try` đang bao quanh vị trí lỗi ở khung hiện tại. Nếu bắt được exception, quá trình lan truyền dừng tại đó.

Nếu không có khối `catch` phù hợp trong khung hiện tại, Java phải rời các phạm vi đang hoạt động trước khi chuyển sang bên gọi:

- `finally` tương ứng vẫn có thể chạy;
- tài nguyên của `try-with-resources` được đóng theo hợp đồng;
- sau các bước dọn dẹp cần thiết, khung hiện tại mới được rời bỏ và quá trình tìm nơi xử lý tiếp tục ở bên gọi.

Ví dụ:

```java
void service() throws IOException {
    try {
        repository();
    } finally {
        System.out.println("service cleanup");
    }
}
```

`repository()` ném `IOException`, nhưng `finally` của `service()` vẫn chạy trước khi exception tiếp tục đi lên.

### Nếu không có ai catch?

Nếu exception thoát khỏi điểm bắt đầu thực thi của thread, nó đi tới cơ chế xử lý ngoại lệ không được bắt (uncaught exception) của thread. Thread đó kết thúc vì luồng thực thi đã hoàn thành theo cách bất thường.

Điều này không đồng nghĩa mọi exception thoát khỏi thread đều lập tức “dừng toàn bộ JVM”; hành vi của tiến trình còn phụ thuộc các thread khác và ngữ cảnh chạy. Điều quan trọng cần nhớ là:

```text
không có khối xử lý
→ lỗi tiếp tục lên tới ranh giới cuối của thread
```

### VÌ SAO CẦN LAN TRUYỀN EXCEPTION?

Tầng repository không cần biết:

- UI sẽ hiển thị thông báo gì;
- yêu cầu HTTP sẽ trả trạng thái nào;
- tác vụ xử lý theo lô (batch job) có thử lại không;
- tầng trên có chuyển đổi exception không.

Nó chỉ báo lỗi. Chính sách xử lý được đặt ở tầng có đủ ngữ cảnh.
