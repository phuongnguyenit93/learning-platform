Người học Instrumentation không cần trở thành chuyên gia kỹ nghệ bytecode trước khi viết agent. Mức kiến thức phù hợp là:

**Cần biết**

- class file chứa method/code/attribute;
- transformer nhận và trả byte[];
- thân method có luồng điều khiển + operand stack/local variables;
- verification/linkage xảy ra sau phép biến đổi;
- phiên bản class file/attribute thay đổi theo JDK;
- mức trừu tượng của công cụ luôn có đánh đổi.

**Chuyển phần chuyên sâu sang JVM / miền bytecode**

- bố trí nhị phân constant pool chi tiết;
- thuật toán verifier chuyên sâu;
- mọi opcode ngữ nghĩa;
- bộ tối ưu bytecode/compiler backend tùy biến.

Mục tiêu là đủ để rà soát rủi ro của phép biến đổi và gỡ lỗi agent, không phải viết assembler từ đầu.
