Ba contract phải đồng ý với nhau: **MemoryLayout của data**, **FunctionDescriptor của call** và **ABI của native binary**.

Ví dụ các mismatch nguy hiểm:

- struct thiếu padding nên field offset bị lệch;
- pointer parameter bị mô tả thành integer;
- native function trả struct nhưng descriptor mô tả scalar;
- binary dùng calling convention khác;
- code build từ header version A nhưng runtime load library version B.

Một số mismatch bị Java/Linker phát hiện sớm, nhưng không phải tất cả. Native function pointer không mang đủ type information để runtime xác minh toàn bộ signature.

Vì vậy binding test nên có giá trị biên và structure known-value: ghi dữ liệu từ Java, đọc bên native và ngược lại; kiểm tra size/offset trước khi chạy workload thật.
