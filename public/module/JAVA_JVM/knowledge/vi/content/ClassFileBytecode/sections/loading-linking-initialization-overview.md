Trước khi một class/interface có thể tham gia execution đầy đủ, JVM có ba khái niệm lifecycle lớn:

```text
Loading
→ tìm/nhận biểu diễn nhị phân và tạo class/interface runtime

Linking
→ verification + preparation + có thể resolution

Initialization
→ thực thi class/interface initialization method <clinit>
```

Loading trả lời “runtime đã có biểu diễn của type này chưa?”. Linking trả lời “biểu diễn đó đã đủ hợp lệ và được tích hợp vào runtime state chưa?”. Initialization trả lời “static initialization semantics đã được thực thi chưa?”.

Module JVM chỉ cần nắm flow và ranh giới lỗi. Chi tiết ClassLoader API, delegation và class-loader identity thuộc module ClassLoader.
