Class đã được JVM nạp không còn là “một file byte tùy ý có thể thay thế bằng bất kỳ schema nào”. JVM đang giữ:

- identity của Class;
- metadata constant-pool/runtime đã được phân giải;
- bố trí field;
- descriptor của method;
- các stack frame đang hoạt động;
- instance và trạng thái static;
- quan hệ kế thừa/module/class loader hiện hữu.

Vì vậy redefine/retransform chỉ cho phép một tập thay đổi tương thích với trạng thái runtime hiện tại.

Mô hình tư duy:

~~~text
phần hiện thực method
→ có thể thay đổi trong giới hạn

hình dạng class / bố trí object / identity kế thừa
→ phần lớn phải giữ ổn định
~~~

Instrumentation mạnh ở việc **thay phần hiện thực/chèn probe**, không phải di chuyển nóng toàn bộ schema kiểu.
