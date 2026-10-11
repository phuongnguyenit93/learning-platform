Native binary thường không portable theo cách bytecode Java portable. Một artifact build cho Linux x86-64 không thể mặc nhiên chạy trên Windows x86-64, và binary ARM64 cũng không thể được load như binary x86-64.

Compatibility cần được nhìn theo một ma trận:

~~~text
OS
× CPU architecture
× ABI / compiler-runtime expectation
× native dependency versions
× Java/JNI/FFM contract
~~~

Vì vậy triển khai thường cần nhiều native artifact, ví dụ một file cho Windows x64, một file cho Linux x64 và một file cho macOS ARM64. Ứng dụng nên chọn artifact theo nền tảng một cách rõ ràng và báo lỗi sớm nếu nền tảng không được hỗ trợ.

Không nên “sửa” incompatibility bằng cách đổi extension file. Binary format, instruction set và ABI mới là contract thật. Đây cũng là lý do native interoperability cần được cô lập sau một Java-facing API: phần còn lại của ứng dụng không nên biết chi tiết package theo nền tảng.

Khi library, symbol và ABI contract đã rõ, chương tiếp theo chuyển sang JNI: bridge truyền thống của JVM dùng các contract native đó để nối Java method với reference, exception và thread boundary.
