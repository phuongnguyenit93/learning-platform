Ba cơ chế giải quyết ba lớp khác nhau:

| Cơ chế | Điểm can thiệp | Phù hợp |
| --- | --- | --- |
| Reflection | truy cập metadata/member ở runtime | inspect/invoke khi type/member được quyết định động |
| Proxy/AOP | lời gọi đi qua ranh giới wrapper/interceptor | hành vi cross-cutting ở lời gọi interface/bean/framework |
| Instrumentation | định nghĩa class/bytecode | chèn/sửa logic ở mức class bất kể lời gọi có đi qua proxy hay không |

Ví dụ OrderService:

~~~text
đọc @Timed annotation
→ Reflection

chặn lời gọi qua Spring proxy
→ Proxy/AOP

instrument method kể cả object được tạo trực tiếp bằng new
→ Instrumentation
~~~

Các cơ chế có thể kết hợp: agent có thể dùng Reflection để khám phá metadata rồi dùng Instrumentation để thay bytecode.
