Tính portable của Java dựa trên ý tưởng: ứng dụng không phát hành trực tiếp machine code cho từng CPU/OS, mà phát hành biểu diễn class file theo một hợp đồng chung; JVM trên từng nền tảng chịu trách nhiệm thực thi hợp đồng đó.

```text
same class file
   ├─→ JVM on Windows/x64
   ├─→ JVM on Linux/x64
   └─→ JVM on Linux/ARM64
```

Mô hình này giảm coupling giữa artifact của ứng dụng và machine instruction set. Tuy vậy, tính portable không tuyệt đối. Code vẫn có thể phụ thuộc filesystem semantics, native library, default charset, đặc điểm hiệu năng theo kiến trúc, OS scheduling hoặc VM option riêng của implementation.

Do đó “write once, run anywhere” nên hiểu là **hợp đồng thực thi có tính portable**, không phải lời bảo đảm rằng mọi hành vi của môi trường đều giống hệt nhau.
