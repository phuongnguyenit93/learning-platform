Khi JVM tạo class/interface ở runtime, thông tin từ class-file constant pool được dùng để tạo **runtime constant pool** tương ứng. Runtime constant pool đóng vai trò gần giống symbol table trong compiler/runtime truyền thống.

Nó chứa:

- static constants đã sẵn sàng sử dụng;
- symbolic references có thể cần resolution;
- biểu diễn runtime phục vụ instruction execution.

Điểm quan trọng: runtime constant pool là **runtime data structure**, không phải chỉ là bytes còn nằm nguyên trong file.

Resolution có thể xảy ra ở thời điểm implementation lựa chọn trong giới hạn của specification. Vì vậy không nên giả định “mọi symbolic reference được resolve ngay khi class vừa load”.
