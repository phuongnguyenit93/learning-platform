Java và native library thường có hai hệ thống báo lỗi khác nhau. Java dùng exception; C API có thể trả số âm, NULL, errno hoặc error object riêng.

Boundary layer nên chuyển đổi lỗi một cách có chủ đích:

~~~text
native return/status
        ↓ kiểm tra kết quả theo contract của library
Java exception/result có ngữ cảnh
        ↓
ứng dụng xử lý theo Java contract
~~~

Với JNI, một Java exception phát sinh trong native call trở thành pending exception và phải được kiểm tra/propagate hoặc clear có chủ ý. Với FFM downcall, native error code không tự biến thành exception; binding phải đọc kết quả theo contract của library.

Call state như `errno` cần cách xử lý chặt hơn. Trong Java 21, khi linker của platform hỗ trợ state đó, hãy dùng `Linker.Option.captureCallState("errno")` (hoặc tên captured state khác được hỗ trợ). Downcall khi đó capture state ngay sau foreign call vào một segment do bên gọi cung cấp, trước khi hoạt động Java/runtime tiếp theo có thể ghi đè native error state theo cơ chế thông thường. Danh sách state được hỗ trợ và layout của vùng capture phụ thuộc platform và có thể được kiểm tra qua `Linker.Option.captureStateLayout()`.

Không nên vừa trả error code vừa ném exception cho cùng một contract nếu bên gọi không biết nguồn sự thật nào cần ưu tiên.
