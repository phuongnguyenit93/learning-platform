Trong **Java 21**, FFM là preview API theo JEP 442. Source dùng java.lang.foreign chỉ compile và run khi preview features được bật.

Ví dụ command line tối thiểu:

~~~bash
javac --release 21 --enable-preview NativeDemo.java
java --enable-preview NativeDemo
~~~

Java 22 là mốc FFM được final hóa, nhưng module này không đi sâu vào lịch sử thay đổi từng release. Điều cần nhớ ở baseline Java 21 là source/API contract vẫn mang trạng thái preview và mã production phải chủ động chấp nhận ràng buộc đó.

**Preview enablement không đồng nghĩa với native-access enablement.** --enable-preview cho phép dùng preview API; restricted operation thuộc một security/safety boundary khác và được trình bày riêng ở phần native access.
