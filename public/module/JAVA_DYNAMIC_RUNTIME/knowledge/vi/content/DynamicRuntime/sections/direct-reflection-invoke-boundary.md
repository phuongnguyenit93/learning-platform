Ba cơ chế thường bị đặt cạnh nhau nhưng trách nhiệm khác nhau:

| Cơ chế | Phù hợp khi | Đặc điểm chính |
| --- | --- | --- |
| Lời gọi trực tiếp | Type và target đã nằm trong code bình thường | Đơn giản nhất, dễ đọc, compiler kiểm tra rõ |
| Reflection | Cần khám phá class/member/annotation hoặc invoke theo metadata | Metadata-first, API quen thuộc cho inspection |
| `java.lang.invoke` | Cần executable handle có kiểu, adaptation/composition hoặc runtime linkage | Runtime/JVM-oriented, mạnh nhưng phức tạp hơn |

Ví dụ Reflection:

```java
Method method = Greeter.class.getMethod("greet", String.class);
Object result = method.invoke(greeter, "Phuong");
```

Ví dụ MethodHandle:

```java
MethodHandles.Lookup lookup = MethodHandles.lookup();
MethodType type = MethodType.methodType(String.class, String.class);
MethodHandle handle = lookup.findVirtual(Greeter.class, "greet", type);

String result = (String) handle.invokeExact(greeter, "Phuong");
```

MethodHandle không thay thế Reflection. Reflection vẫn sở hữu bài toán runtime inspection; module này chỉ so sánh đủ để người học hiểu vì sao một framework có thể “inspect bằng Reflection nhưng execute bằng MethodHandle”.
