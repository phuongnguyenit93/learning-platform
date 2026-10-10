Native library có thể thất bại ở nhiều tầng khác nhau. Phân loại đúng tầng giúp tránh gỡ lỗi sai chỗ.

~~~text
không tìm thấy file
→ lỗi loading

file có nhưng sai architecture / thiếu dependency
→ lỗi loader/linker

library load được nhưng không có symbol
→ lỗi symbol resolution

symbol có nhưng descriptor/ABI sai
→ lỗi tại call boundary, có thể crash
~~~

JNI thường biểu hiện một số lỗi loading/binding bằng UnsatisfiedLinkError. FFM SymbolLookup.find có thể không trả symbol mong đợi. OS loader còn có thông báo riêng về dependency hoặc binary format.

Khi điều tra, hãy ghi rõ library path/name, OS/architecture, dependency native và symbol/version đang kỳ vọng thay vì chỉ log “native call failed”.
