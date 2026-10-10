Quy tắc lựa chọn đơn giản:

```text
Code biết rõ target và gọi bình thường được?
→ direct call

Cần inspect metadata/member/annotation runtime?
→ Reflection

Cần executable reference có kiểu,
chuỗi handle có thể adapt/compose,
hoặc runtime linkage primitive?
→ MethodHandle / java.lang.invoke
```

Không dùng MethodHandle chỉ để tránh viết một lời gọi method bình thường:

```java
service.process(request);
```

vẫn tốt hơn một chuỗi lookup + invoke nếu không có yêu cầu runtime thật.

MethodHandle thường có giá trị trong framework, runtime, serializer, dynamic-language support, FFM plumbing hoặc generated dispatch layer — nơi việc biểu diễn hành vi thành executable handle là một phần của thiết kế.
