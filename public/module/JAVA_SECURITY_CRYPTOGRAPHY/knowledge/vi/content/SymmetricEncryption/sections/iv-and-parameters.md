Nhiều mode cần **IV hoặc nonce** ngoài secret key. Giá trị này thường không cần giữ bí mật, nhưng phải thỏa property mà mode yêu cầu: có mode cần unpredictability, có mode đặc biệt cần uniqueness.

Không được suy “IV không phải secret nên dùng gì cũng được”. Reuse IV/nonce có thể phá security nghiêm trọng.

Java biểu diễn parameter qua các spec như IvParameterSpec hoặc GCMParameterSpec. Khi encrypt, ứng dụng thường lưu/transmit parameter cần thiết cùng ciphertext để decrypt bên kia có đủ context.

~~~text
stored/transmitted package
= algorithm/version metadata
+ IV/nonce
+ ciphertext
(+ authentication tag tùy mode)
~~~

Key là secret; IV/nonce thường là public parameter nhưng vòng đời vẫn phải đúng protocol.
