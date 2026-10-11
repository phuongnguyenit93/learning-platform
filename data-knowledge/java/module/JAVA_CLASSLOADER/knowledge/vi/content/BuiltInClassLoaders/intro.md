# Các ClassLoader có sẵn trong JVM

Sau chương Lifecycle, ta biết JVM cần cơ chế nạp để đưa bytecode thành class khi chạy. Câu hỏi tiếp theo là: **trong một tiến trình Java 21 bình thường, những ClassLoader nào đã tồn tại sẵn và ClassLoader nào định nghĩa từng nhóm class trước khi ta viết ClassLoader tùy chỉnh?**

JDK hiện đại tổ chức phần lớn class loading mặc định thành một chuỗi khái niệm:

```text
Bootstrap loader
       ↑
Platform ClassLoader
       ↑
Application/System ClassLoader
       ↑
class của ứng dụng
```

Các ClassLoader này có phạm vi trách nhiệm khác nhau. Hiểu đúng chúng giúp ta đọc `Class#getClassLoader()`, chẩn đoán “class do ClassLoader nào định nghĩa”, và chuẩn bị cho cơ chế ủy quyền cho ClassLoader cha ở chương sau.

Vì sao Java không gom mọi thứ vào một ClassLoader duy nhất? Việc phân chia trách nhiệm thành các tầng giúp môi trường chạy tạo ranh giới rõ giữa **class lõi của JDK**, **class nền tảng** và **class của ứng dụng**. Nhờ vậy class nền tảng có một nơi sở hữu ổn định, mã ứng dụng không phải tự định nghĩa lại chúng, và ClassLoader tùy chỉnh sau này có thể chọn chính xác tầng nào làm ClassLoader cha để quyết định phần nào được chia sẻ và phần nào cần cô lập.
