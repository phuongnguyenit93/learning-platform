Foreign Function & Memory API (FFM) cung cấp Java API để làm việc với code và data nằm ngoài Java runtime. Hai bài toán được gom vào cùng một model:

- **foreign memory**: biểu diễn và truy cập vùng nhớ trong/ngoài heap bằng MemorySegment;
- **foreign function**: tìm native symbol và tạo call boundary bằng Linker.

FFM giúp phần lớn binding logic được mô tả bằng Java thay vì phải viết một lớp JNI glue bằng C chỉ để gọi function native. Tuy nhiên FFM không biến native code thành managed Java: ABI, pointer, lifetime và crash risk vẫn tồn tại.

Baseline của module là **Java 21**, nơi package java.lang.foreign là preview API. Vì vậy mọi ví dụ FFM phải được hiểu trong preview context của JDK 21.
