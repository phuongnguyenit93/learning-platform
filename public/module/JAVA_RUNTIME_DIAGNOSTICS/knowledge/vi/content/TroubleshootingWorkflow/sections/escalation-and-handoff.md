Một cuộc điều tra chẩn đoán nên dừng hoặc chuyển sang chuyên môn khác khi:

- giả thuyết đã được bằng chứng đủ mạnh xác nhận và phần sửa nằm ở lĩnh vực khác;
- cần ngữ nghĩa chuyên sâu mà Runtime Diagnostics không sở hữu;
- bằng chứng hiện tại không đủ nhưng bước tiếp theo thuộc công cụ/platform chuyên biệt;
- chi phí thu thêm dữ liệu vượt lợi ích hoặc vượt mức rủi ro chấp nhận được trên môi trường production.

Các điểm chuyển chính:

| Bằng chứng chỉ ra | Chuyển sang |
| --- | --- |
| GC/JIT/runtime-memory mechanics | JAVA_JVM |
| lock/happens-before/concurrency correctness | JAVA_CONCURRENCY_FUNDAMENTALS |
| cần active bytecode instrumentation | JAVA_INSTRUMENTATION |
| JNI/FFM/native library/memory | JAVA_NATIVE_INTEROPERABILITY |
| Arthas hoặc phân tích runtime theo công cụ cụ thể | nhóm phụ trách công cụ observability |

Một lần chuyển giao tốt phải mang theo bằng chứng và giả thuyết hiện tại, không chỉ câu “có vẻ là JVM”. Điều đó giúp nhóm phụ trách lĩnh vực chuyên trách tiếp tục điều tra thay vì bắt đầu lại từ đầu.
