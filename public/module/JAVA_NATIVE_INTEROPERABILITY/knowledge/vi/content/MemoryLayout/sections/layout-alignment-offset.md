Ba giá trị cần kiểm tra khi map native structure là **size, alignment và offset**.

- byteSize() cho biết layout chiếm bao nhiêu byte;
- byteAlignment() cho biết alignment constraint;
- byteOffset(path...) tính offset của nested layout theo layout path.

Ví dụ:

~~~java
long valueOffset = taggedValue.byteOffset(
        MemoryLayout.PathElement.groupElement("value"));
~~~

Alignment không phải decoration. Native ABI có thể yêu cầu một field bắt đầu ở địa chỉ chia hết cho một alignment nhất định. Nếu layout bỏ padding hoặc dùng alignment sai, binary view của Java và native code sẽ không còn giống nhau.

Khi review binding, nên so sánh size/offset với header/compiler information của native side thay vì chỉ nhìn code Java.
