Java 21 định nghĩa thứ tự transformer theo bốn nhóm:

~~~text
1. Java transformers không hỗ trợ retransformation
2. native transformers không hỗ trợ retransformation
3. Java transformers hỗ trợ retransformation
4. native transformers hỗ trợ retransformation
~~~

Trong từng nhóm, transformer được gọi theo thứ tự đăng ký.

Điều này nghĩa là “thứ tự đăng ký” chỉ đúng **bên trong một nhóm**. Một transformer canRetransform=true có thể được đăng ký trước một transformer canRetransform=false nhưng vẫn chạy sau nhóm không hỗ trợ retransformation.

Native transformer thuộc JVMTI ClassFileLoadHook và được nhắc ở đây chỉ để hiểu đầy đủ thứ tự. Việc viết native agent/JVMTI không thuộc phạm vi của module.
