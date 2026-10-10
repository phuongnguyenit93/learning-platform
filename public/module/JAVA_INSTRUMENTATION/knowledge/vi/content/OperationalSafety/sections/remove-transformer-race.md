removeTransformer có race được API ghi rõ: do quá trình nạp class đa luồng, transformer **có thể vẫn nhận callback sau khi đã được gỡ**.

Do đó:

~~~java
enabled.set(false);
inst.removeTransformer(transformer);
~~~

transformer vẫn cần kiểm tra trạng thái:

~~~java
if (!enabled.get()) {
    return null;
}
~~~

Nếu giải phóng tài nguyên ngay sau remove nhưng callback trễ vẫn dùng tài nguyên đó, agent có thể xảy ra race.

Quy trình dừng an toàn cần nghĩ tới:

- trạng thái enabled dạng atomic;
- bộ đếm callback đang chạy nếu cần;
- vòng đời tài nguyên;
- callback không chặn vô thời hạn;
- dọn dẹp theo kiểu idempotent.

Đây là ví dụ rõ rằng code Instrumentation chạy trên đường thực thi runtime đồng thời, không phải một vòng đời tuần tự đơn giản.
