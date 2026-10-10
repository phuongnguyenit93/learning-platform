JDK 21 triển khai hướng của JEP 451: khi agent được nạp động vào JVM đang chạy, JVM phát cảnh báo để chuẩn bị cho tương lai khi nạp động có thể bị tắt mặc định.

Trên HotSpot JDK 21:

- nạp agent động vẫn được phép mặc định;
- JVM phát cảnh báo khi agent được nạp động;
- -XX:+EnableDynamicAgentLoading thể hiện opt-in rõ ràng và loại bỏ cảnh báo;
- -XX:-EnableDynamicAgentLoading có thể tắt việc nạp động.

Thông điệp thiết kế quan trọng không phải thuộc lòng flag, mà là:

~~~text
startup instrumentation
→ người sở hữu triển khai cho phép rõ ngay từ lúc JVM khởi động

dynamic instrumentation
→ thay đổi runtime sau startup
→ phải chịu chính sách/quyền cho phép chặt hơn
~~~

Agent/công cụ nên ưu tiên nạp lúc khởi động khi biết trước nhu cầu instrumentation; dynamic attach phù hợp với chẩn đoán theo nhu cầu nhưng không nên được coi là quyền mặc định vĩnh viễn.
