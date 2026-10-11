Phong cách hàm thường hữu ích khi phần thay đổi có thể biểu diễn bằng một hợp đồng hành vi nhỏ và rõ ràng. Một số trường hợp điển hình:

- biểu diễn điều kiện bằng `Predicate<T>`;
- biến đổi một giá trị sang giá trị khác bằng `Function<T, R>`;
- cung cấp công việc tạo ra giá trị khi được gọi bằng `Supplier<T>`;
- truyền quy tắc sắp xếp bằng `Comparator<T>`;
- đăng ký hàm gọi lại hoặc hành động;
- kết hợp các hành vi nhỏ thành thao tác lớn hơn.

Ngược lại, nếu một quy trình có trạng thái vốn đã rõ ràng mà bị chia thành quá nhiều lambda nhỏ, luồng thực thi có thể khó theo dõi hơn. Lambda nên giảm phần cú pháp thừa hoặc làm rõ điểm biến thiên, không nên che giấu các bước nghiệp vụ quan trọng chỉ để mã trông "theo phong cách hàm" hơn.

Câu hỏi thực dụng là: **truyền hành vi này vào có làm ý định của bên gọi và phần mã tái sử dụng rõ hơn không?** Nếu có, giao diện hàm thường là lựa chọn phù hợp.
