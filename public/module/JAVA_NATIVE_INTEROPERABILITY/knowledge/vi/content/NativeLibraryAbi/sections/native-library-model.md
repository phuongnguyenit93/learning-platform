Native library là binary đã được compiler/linker tạo cho một platform cụ thể và có thể được nạp vào process Java. Trên thực tế nó thường xuất hiện dưới dạng DLL trên Windows, shared object trên Linux hoặc dynamic library trên macOS.

Một library không chỉ là “file chứa code”. Nó còn mang **symbol** mà linker/runtime có thể tìm, và những symbol đó tuân theo một **ABI (Application Binary Interface)** về cách truyền argument, nhận return value, alignment và calling convention.

Trong Java có hai góc nhìn chính:

- với **JNI**, library chứa phần triển khai của native method hoặc đăng ký chúng qua RegisterNatives;
- với **FFM**, Java tìm symbol trong library bằng SymbolLookup rồi tạo foreign call thông qua Linker.

Vì vậy luồng luôn bắt đầu bằng cùng một câu hỏi: binary nào được load, trên nền tảng nào, và Java/native side đang đồng ý với binary contract nào?
