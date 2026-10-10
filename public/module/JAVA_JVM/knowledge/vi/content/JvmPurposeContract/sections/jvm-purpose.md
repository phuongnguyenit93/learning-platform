JVM (Java Virtual Machine) là máy trừu tượng thực thi chương trình ở dạng **class file**, thay vì chạy trực tiếp mã nguồn Java trên CPU. Nhờ lớp trung gian này, compiler có thể tạo ra một biểu diễn chung, còn cách triển khai JVM chịu trách nhiệm ánh xạ biểu diễn đó xuống hệ điều hành, kiến trúc CPU, tổ chức bộ nhớ nội bộ và các cơ chế tối ưu cụ thể.

Vấn đề mà JVM giải quyết không chỉ là “chạy Java ở nhiều hệ điều hành”. Nếu không có một hợp đồng thực thi chung, mỗi ngôn ngữ/compiler sẽ phải gắn chặt hơn với từng nền tảng máy, tự quản lý nhiều chi tiết runtime và khó chia sẻ cùng một hệ sinh thái thư viện/tooling. JVM tạo ra một ranh giới ổn định giữa **biểu diễn chương trình** và **cách máy thật thực thi**.

Một cách đơn giản hơn là compile thẳng source thành native machine code cho từng target. Cách đó vẫn chạy được chương trình, nhưng gánh nặng portability/distribution chuyển sang compiler và bộ artifact theo từng kiến trúc/OS; cũng không có một **JVM contract chung** bắt buộc mọi target cùng chia sẻ. Một native runtime khác vẫn có thể cung cấp GC hoặc tooling riêng, nhưng đó là runtime contract khác. JVM thêm lớp trung gian để đổi sự phụ thuộc “ứng dụng ↔ máy cụ thể” thành “class file ↔ JVM contract”.

Trong module này, hãy luôn giữ mô hình tư duy:

```text
source language
    ↓ compiler
class-file representation
    ↓ JVM implementation
runtime state + native machine execution
```

JVM vì vậy vừa là một abstraction được đặc tả, vừa có nhiều cách triển khai cụ thể. HotSpot là một cách triển khai phổ biến, nhưng không phải bản thân “định nghĩa JVM”.
