JNI reference lifetime sai có hai dạng chính: **dùng reference sau khi hết hạn** và **giữ reference quá lâu**.

Local reference luôn gắn với thread và local frame JNI. Với local reference được tạo trong Java → native method call, reference đó hết hiệu lực khi native method trả về; không được cất vào native global state để dùng ở một call sau. Native thread được attach qua Invocation API là trường hợp khác: local reference của nó có thể tồn tại qua nhiều JNI call cho tới khi bị xóa/pop frame hoặc thread detach, nhưng vẫn không phải reference dùng chung qua thread. Nếu cần giữ Java object độc lập với local frame/thread lifetime, phải tạo global reference.

Ngược lại, global reference giữ Java object reachable cho tới khi DeleteGlobalRef. Quên xóa reference tạo leak dù heap profiler có thể khiến object trông như “vẫn còn được dùng”.

Trong loop native dài, quá nhiều local reference cũng có thể làm đầy local-reference table. DeleteLocalRef hoặc local frame giúp giữ phạm vi reference nhỏ.

Quy tắc thực tế: lifetime của reference phải phản ánh đúng vòng đời sử dụng của object, không dài hơn chỉ vì “đỡ phải tạo lại”.
