JVM không phải “máy chỉ hiểu mã nguồn Java”. Nó hiểu các cấu trúc được biểu diễn trong class-file format và instruction set của JVM. Java compiler là một nguồn tạo class file; các ngôn ngữ JVM khác cũng có thể compile xuống cùng target.

Điều này giải thích vì sao nhiều ngôn ngữ có thể:

- dùng chung Java class library;
- gọi code của nhau khi quy ước kiểu và interop ở JVM level tương thích;
- dùng cùng GC, JIT, profiler và diagnostic tooling;
- chạy trong cùng tiến trình/runtime.

Tuy nhiên, “cùng JVM” không có nghĩa mọi tính năng ngôn ngữ đều map một-một sang tính năng Java. Một compiler có thể biểu diễn semantics riêng bằng synthetic methods, `invokedynamic`, metadata hoặc runtime library của chính nó.

Trong module JVM, ta học **nền thực thi chung**, không học semantics của từng ngôn ngữ JVM.
