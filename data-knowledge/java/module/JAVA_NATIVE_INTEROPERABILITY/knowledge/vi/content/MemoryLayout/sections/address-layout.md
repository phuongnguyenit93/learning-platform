AddressLayout là ValueLayout đặc biệt biểu diễn một giá trị có hình dạng **địa chỉ native**. Khi đọc một address từ MemorySegment, carrier nhận được là một MemorySegment đại diện cho address đó thay vì Java long tùy tiện.

Trong foreign function signature, AddressLayout thường xuất hiện ở vị trí tương ứng với pointer parameter hoặc pointer return.

~~~java
FunctionDescriptor descriptor = FunctionDescriptor.of(
        ValueLayout.JAVA_INT,
        ValueLayout.ADDRESS
);
~~~

Address không tự mang đầy đủ thông tin về vùng nhớ đích. `AddressLayout` có thể gắn **target layout** để mô tả shape Java kỳ vọng ở địa chỉ đó, nhưng target layout vẫn không chứng minh rằng vùng nhớ thật sự hợp lệ, đủ lớn, còn sống hay do Java sở hữu. Một pointer native có thể chỉ cung cấp address mà không biết chắc size/lifetime của target region; để biến nó thành vùng có thể dereference an toàn có thể cần quy tắc rõ về size/lifetime và, trong một số trường hợp, restricted reinterpretation.

Không nên biến pointer thành số long rồi làm arithmetic nếu FFM API đã có abstraction phù hợp. Trong Java 21, một số thao tác target-layout/reinterpret là restricted chính vì mô tả sai spatial/temporal bounds có thể làm mất các bảo đảm memory-safety.
