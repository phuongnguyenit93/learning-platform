Module JVM học **native-memory awareness** để hiểu tổng mức chiếm dụng bộ nhớ của tiến trình và các resource của implementation.

Native Interoperability học cách Java code **chủ động tương tác với native world**:

- JNI;
- Foreign Function & Memory API;
- native library loading;
- symbol lookup/linker;
- explicit native-memory lifetime.

```text
JVM Process Memory
→ “runtime đang dùng memory ở đâu?”

Native Interoperability
→ “Java code gọi/đọc/ghi native resource như thế nào?”
```

Hai chủ đề gặp nhau ở memory safety/lifetime nhưng có learning objective khác nhau.
