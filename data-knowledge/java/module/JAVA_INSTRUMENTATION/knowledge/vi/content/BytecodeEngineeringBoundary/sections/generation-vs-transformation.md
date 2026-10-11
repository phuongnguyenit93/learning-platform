**Sinh class** và **biến đổi class** có quan hệ nhưng không giống nhau.

Sinh class:

~~~text
không có định nghĩa class cũ
→ tạo class mới từ mô hình/builder
→ tạo byte[]
~~~

Biến đổi:

~~~text
đã có class-file bytes
→ giữ phần lớn cấu trúc
→ thay một phần cần thiết
→ tạo byte[] mới
~~~

Java Agent thường cần phép biến đổi vì class mục tiêu đã tồn tại trong ứng dụng. Tuy nhiên công cụ bytecode vẫn có thể sinh helper/proxy/auxiliary class.

Ranh giới của module:

- hiểu phép biến đổi đủ để instrument method đúng;
- hiểu việc sinh class đủ để phân biệt trường hợp sử dụng;
- không biến module thành khóa học compiler/code generator tổng quát.

Khi class đã được nạp, việc sinh class mới cũng **không né được** các giới hạn cấu trúc của redefine/retransform đối với class cũ.
