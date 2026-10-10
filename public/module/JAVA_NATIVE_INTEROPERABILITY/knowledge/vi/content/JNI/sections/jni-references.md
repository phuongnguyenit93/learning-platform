Reference JNI không phải raw pointer tới Java object. JVM cần biết reference nào còn hợp lệ để GC và object movement vẫn hoạt động đúng.

**Local reference** là reference gắn với luồng và local frame JNI. Trong một Java → native method call, JVM tự giải phóng các local reference của call đó khi native method trả về Java. Với native thread được attach qua Invocation API và không có native-method return boundary tương ứng, local reference có thể tồn tại cho tới khi bị `DeleteLocalRef`, local frame bị pop, hoặc thread detach; vì vậy thread sống lâu vẫn phải giải phóng local reference chủ động để tránh làm đầy local-reference table.

**Global reference** được tạo bằng NewGlobalRef và tồn tại cho tới khi DeleteGlobalRef được gọi. Nó phù hợp khi trạng thái native cần giữ Java object **độc lập với local frame hoặc lifetime của thread hiện tại**, nhưng chính vì giữ object reachable nên quên xóa global reference tạo ra leak logic.

Weak global reference cho phép GC thu object. Vì trạng thái có thể thay đổi giữa một lần kiểm tra và lần dùng tiếp theo, không nên chỉ kiểm tra reference rồi dereference trực tiếp. Khi cần sử dụng referent, hãy **promote** weak global reference thành một strong local/global reference, chẳng hạn bằng `NewLocalRef`; nếu kết quả là `NULL` thì object đã bị thu, còn reference mạnh hợp lệ sẽ giữ object sống trong khoảng sử dụng đó.

Quy tắc thực tế:

~~~text
chỉ dùng trong local frame/current native call → local reference
cần giữ vượt local-frame/thread lifetime → global reference + giải phóng rõ ràng
không muốn giữ object sống → cân nhắc weak global reference
~~~
