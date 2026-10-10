Chẩn đoán heap/GC trả lời các câu hỏi như:

- vì sao heap liên tục tăng?
- OutOfMemoryError đến từ áp lực heap hay nguyên nhân khác?
- tốc độ cấp phát object có quá cao không?
- GC có đang chạy quá thường xuyên?
- có dấu hiệu object bị giữ lại lâu hơn mong đợi không?

Điểm quan trọng là tách **cơ chế JVM** khỏi **bằng chứng chẩn đoán**. Module JVM sở hữu heap layout, collector và cơ chế cấp phát; chapter này tập trung cách dùng histogram, heap dump, GC logs và JFR để kiểm tra giả thuyết.

Mental model:

~~~text
memory symptom
   ↓
mức dùng heap + hành vi GC
   ↓
histogram / heap dump / JFR
   ↓
giả thuyết giữ object hoặc cấp phát
~~~
