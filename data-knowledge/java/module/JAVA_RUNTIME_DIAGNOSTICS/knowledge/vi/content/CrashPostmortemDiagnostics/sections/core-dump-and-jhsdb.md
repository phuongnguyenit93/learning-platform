**Core dump** là ảnh chụp bộ nhớ tiến trình do hệ điều hành tạo ra tại thời điểm crash hoặc khi được yêu cầu. Nó lớn hơn fatal error log nhưng giữ nhiều trạng thái hơn, nên đặc biệt hữu ích khi cần postmortem ở mức native/VM.

Trong JDK, nhóm công cụ **jhsdb** dùng Serviceability Agent để đọc trạng thái HotSpot từ core dump hoặc tiến trình. Các subcommand như jhsdb jstack, jhsdb jmap và jhsdb jinfo cung cấp các góc nhìn khác nhau trên dữ liệu đó.

Ví dụ ý tưởng:

~~~text
jhsdb jstack --exe <java-executable> --core <core-file>
jhsdb jmap   --histo --exe <java-executable> --core <core-file>
~~~

Core dump chỉ thực sự hữu ích khi đi kèm đúng executable/JDK build và, với native code, symbol phù hợp. `jhsdb` là công cụ **experimental và unsupported**. Theo tài liệu Java 21, attach `jhsdb` vào một tiến trình đang chạy **sẽ làm tiến trình hang** và tiến trình **có khả năng crash khi debugger detach**. Vì vậy không dùng Serviceability Agent cho chẩn đoán live thông thường; hãy ưu tiên `jcmd`, JFR hoặc JMX khi JVM còn sống.

Một core dump cũng có thể chứa dữ liệu nhạy cảm vì nó phản ánh bộ nhớ của tiến trình. Việc lưu trữ, truyền và chia sẻ phải tuân theo chính sách bảo mật của hệ thống.
