Đây là một ranh giới **triển khai/lúc chạy**, không phải kiến thức bắt buộc để hiểu `Method.invoke()` hay `Field.get()`. Trước tiên cần giải nghĩa vài thuật ngữ:

- **JVM/HotSpot**: cách chạy Java thông thường, nơi bytecode được JVM nạp và có thể được JIT biên dịch trong lúc chương trình chạy;
- **AOT (ahead-of-time)**: biên dịch trước khi chương trình bắt đầu chạy thay vì chờ lúc chạy mới biên dịch/phân giải mọi thứ;
- **native executable**: file thực thi native được tạo sẵn cho nền tảng đích;
- **closed-world analysis**: công cụ xây dựng giả định tập mã cần tồn tại phải được xác định từ những gì nó có thể thấy tại thời điểm xây dựng;
- **reachability metadata**: thông tin bổ sung nói cho công cụ xây dựng biết những class/thành phần nào vẫn cần được giữ vì chúng chỉ được tìm động lúc chạy.

Trên JVM thông thường, ứng dụng có thể quyết định lúc chạy rằng nó cần class/thành phần nào rồi dùng Reflection để tìm chúng. Một hệ thống native image theo mô hình AOT + closed-world có bài toán khác: công cụ xây dựng cần biết phần chương trình nào phải tồn tại trong native executable.

GraalVM Native Image là ví dụ điển hình. Phân tích tĩnh có thể nhận ra một số quyền truy cập qua Reflection khi đối tượng đích đủ rõ tại thời điểm xây dựng, nhưng truy cập phụ thuộc chuỗi/cấu hình lúc chạy thường cần **reachability metadata** để khai báo class, method, field, proxy hoặc tính năng động cần giữ lại.

Mô hình tư duy:

```text
thế giới JVM động
đầu vào lúc chạy → chọn thành phần → Reflection tìm thành phần

native image theo mô hình closed world
phân tích lúc xây dựng + reachability metadata
        ↓
quyết định thành phần nào có trong file thực thi
```

Vì vậy framework dùng Reflection nhiều cần nghĩ đến tích hợp native image ngay tại lớp siêu dữ liệu. Một ứng dụng chạy đúng trên HotSpot nhưng thiếu reachability metadata có thể lỗi trong native executable khi thành phần động không được đăng ký/giữ lại.

Cấu hình native image là ranh giới của môi trường triển khai/lúc chạy khác, không thay đổi ngữ nghĩa của Java Reflection trên JVM. Không nên đưa mối quan tâm về native image vào mọi class nghiệp vụ; framework hoặc mô-đun tích hợp nên sở hữu các gợi ý/siêu dữ liệu tương ứng.
