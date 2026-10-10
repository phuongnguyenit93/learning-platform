ABI là contract nhị phân giữa bên gọi và function native. Nó quy định những điều mà Java type system không thể tự kiểm tra: argument đi qua register hay stack, return value được đặt ở đâu, dữ liệu có size/alignment nào và calling convention hoạt động ra sao.

Ví dụ, một function C có vẻ đơn giản:

~~~c
long sum(long a, long b);
~~~

nhưng không nên suy luận rằng C long luôn tương đương Java long. Kích thước native type phụ thuộc ABI/platform. Khi dùng FFM, FunctionDescriptor và MemoryLayout phải mô tả đúng contract thực tế; khi dùng JNI, signature native phải đúng với JNI type contract.

Linker của FFM biết ABI của native platform mà JVM đang chạy và thực hiện phần adaptation cần thiết. Tuy nhiên Linker không thể sửa một FunctionDescriptor sai. Nếu Java mô tả sai signature, kết quả có thể từ IllegalArgumentException cho tới undefined native behavior.
