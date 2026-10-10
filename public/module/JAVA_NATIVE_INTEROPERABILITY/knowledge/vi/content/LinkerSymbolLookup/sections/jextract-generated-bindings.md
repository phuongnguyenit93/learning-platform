jextract là tooling hỗ trợ tạo Java bindings từ C header để giảm lượng boilerplate khi dùng FFM. Nó có thể sinh code đại diện cho function, constant và layout thay vì buộc developer viết mọi SymbolLookup/FunctionDescriptor bằng tay.

Vai trò của jextract trong module này là **supporting tooling**, không phải một abstraction nền tảng của FFM và cũng không thay thế việc hiểu ABI/lifetime.

Generated binding vẫn cần được review theo các câu hỏi:

- header có đúng version với native binary được deploy không?
- generated layout có đúng platform target không?
- lifetime của MemorySegment/Arena có phù hợp use case không?
- function nào là restricted/native-access boundary?
- callback/error ownership được quản lý ở đâu?

jextract hữu ích nhất sau khi người học đã hiểu luồng thủ công symbol → descriptor → linker. Khi đó generated code trở thành cách tự động hóa contract đã hiểu, thay vì “magic wrapper” khó gỡ lỗi.

Khi symbol resolution và function signature đã rõ, chương tiếp theo thực thi boundary theo cả hai chiều: downcall từ Java sang native code và upcall khi native code gọi callback Java.
