Ở native boundary, mỗi tài nguyên cần một **chủ sở hữu** và một thời điểm giải phóng rõ ràng. Tài nguyên không chỉ là native memory; nó có thể là JNI global reference, callback stub, native library association, file mapping hoặc handle do thư viện C trả về.

Một bảng quyền sở hữu đơn giản thường giúp phát hiện lỗi sớm:

| Tài nguyên | Ai tạo? | Ai giải phóng? | Vòng đời |
| --- | --- | --- | --- |
| Allocation từ closeable Arena (`ofConfined` / `ofShared`) | Java binding | Arena.close | theo tác vụ/component |
| Allocation từ `Arena.ofAuto()` / `Arena.global()` | Java binding/runtime | không close thủ công | theo GC-managed lifetime / process lifetime |
| JNI global reference | native code | DeleteGlobalRef | tới khi không cần giữ object |
| upcall stub | Java binding | theo Arena liên kết; `Arena.close()` nếu Arena closeable | tới khi callback đã unregister và Arena kết thúc vòng đời |
| native handle | native library | API close/free tương ứng | theo contract library |

Không phải mọi Arena đều close được: `ofConfined` và `ofShared` hỗ trợ explicit close, còn `ofAuto` và `global` không được giải phóng bằng `Arena.close()`. Nếu không trả lời được một trong ba cột cuối, thiết kế chưa đủ rõ để production hóa.
