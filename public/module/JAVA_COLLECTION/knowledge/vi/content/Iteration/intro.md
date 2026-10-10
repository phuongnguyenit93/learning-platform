# Duyệt dữ liệu với Iterator

Sau khi chọn được cấu trúc dữ liệu phù hợp, phần lớn thuật toán vẫn cần đi qua các phần tử. Nếu mỗi cách triển khai bắt bên gọi biết cách mảng, nút, cây hay bucket hash được tổ chức bên trong thì mã nguồn sẽ bị gắn chặt với cách triển khai. Java tách **giao thức duyệt** khỏi **cấu trúc lưu trữ** thông qua `Iterable`, `Iterator`, `ListIterator` và `Spliterator`.
