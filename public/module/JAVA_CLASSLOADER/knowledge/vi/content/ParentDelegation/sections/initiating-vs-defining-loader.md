Hai thuật ngữ này không hoàn toàn giống nhau:

- với một class/interface có tên thông thường, **ClassLoader định nghĩa (defining loader)** là ClassLoader chịu trách nhiệm định nghĩa kiểu khi chạy đó;
- **ClassLoader khởi xướng (initiating loader)** là ClassLoader đã khởi xướng việc nạp trực tiếp hoặc qua ủy quyền. Một class/interface thông thường có thể được JVM ghi nhận với nhiều initiating loaders, nhưng chỉ có một defining loader.

Ví dụ ClassLoader của plugin gọi `loadClass("java.lang.String")`, nhưng cơ chế ưu tiên cha cuối cùng trả `String` do Bootstrap ClassLoader định nghĩa. ClassLoader của plugin có thể được ghi nhận là một initiating loader của `String`, nhưng định danh class của `String` khi chạy vẫn gắn với Bootstrap ClassLoader ở vai trò defining loader.

Trong phần lớn suy luận về “hai kiểu có giống nhau không”, **ClassLoader định nghĩa (defining loader)** là phần quan trọng.
