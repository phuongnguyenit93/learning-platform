# Cơ chế ủy quyền cho ClassLoader cha

Ta vừa thấy application loader có parent là platform loader, và platform loader đứng trên bootstrap boundary. Chuỗi đó chỉ hữu ích khi có một quy tắc trả lời:

> Khi ứng dụng cần `java.lang.String` hoặc `com.example.Plugin`, loader hiện tại sẽ tự tìm trước hay hỏi parent trước?

Contract mặc định của `ClassLoader` dùng **parent-first delegation**. Cơ chế này giúp các type nền tảng và dependency được chia sẻ nhất quán thay vì mỗi child loader tự tạo bản sao của cùng một class.
