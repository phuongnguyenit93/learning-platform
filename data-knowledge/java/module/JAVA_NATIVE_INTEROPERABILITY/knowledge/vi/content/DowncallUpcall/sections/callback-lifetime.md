Callback pointer có thể được native library lưu lại để gọi **sau khi downcall ban đầu đã return**. Vì thế vòng đời của upcall stub phải dài ít nhất bằng khoảng thời gian phía native còn có thể gọi pointer đó.

Mẫu sai:

~~~text
tạo Arena trong method
→ tạo upcall stub
→ native library lưu callback
→ method return, Arena close
→ native library gọi lại address đã hết lifetime
~~~

Thiết kế đúng thường có quyền sở hữu rõ ràng: component đăng ký callback sở hữu Arena, giữ Arena sống cho tới khi unregister callback thành công, rồi mới close.

Nếu native API không có contract về unregister/vòng đời rõ ràng, callback binding cần đặc biệt thận trọng vì rất khó chứng minh lúc nào address có thể được giải phóng an toàn.
