Native code nhìn dữ liệu như bytes tuân theo một binary layout cụ thể. Java object layout không phải contract tương đương với C struct, vì JVM có quyền tổ chức object theo cách riêng.

MemoryLayout cho phép Java mô tả **hình dạng dữ liệu trong memory**: kích thước, alignment, thứ tự field, sequence, union hoặc address. Layout sau đó được dùng để tính offset và truy cập MemorySegment có cấu trúc.

Ví dụ một C struct:

~~~c
struct Point {
    int x;
    int y;
};
~~~

có thể được biểu diễn bằng các ValueLayout nằm trong StructLayout. Điều quan trọng là Java đang mô tả binary contract của native data, không phải tạo một Java class “giống struct”.
