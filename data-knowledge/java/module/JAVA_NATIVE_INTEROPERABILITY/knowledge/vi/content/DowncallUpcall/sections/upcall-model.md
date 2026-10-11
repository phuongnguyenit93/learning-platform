**Upcall** là chiều ngược: native code gọi lại Java qua một function pointer. FFM tạo một upcall stub từ Java MethodHandle để native library có thể nhận pointer đó như callback.

Use case điển hình:

- comparator truyền vào qsort;
- callback báo tiến độ;
- native library phát event về Java;
- library yêu cầu user-provided handler.

Mental model:

~~~text
Java method
   ↓ MethodHandle
upcall stub
   ↓ function pointer
native library
   ↓ callback
Java method được thực thi
~~~

Upcall làm callback tiện hơn việc viết JNI glue riêng, nhưng callback lifetime và thread context trở thành phần quan trọng của contract.
