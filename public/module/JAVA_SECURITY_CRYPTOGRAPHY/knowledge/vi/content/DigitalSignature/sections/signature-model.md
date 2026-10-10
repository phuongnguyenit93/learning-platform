Digital signature dùng asymmetric key pair để tách quyền **ký** và **xác minh**.

~~~text
message + private key
       ↓ sign
signature

message + signature + public key
       ↓ verify
true / false
~~~

Private key phải được giữ bí mật; public key có thể phân phối cho verifier. Signature tạo authenticity/integrity dựa trên việc verifier tin rằng public key thực sự thuộc signer dự kiến.

Đó là lý do certificate/trust xuất hiện sau chapter này: signature math có thể đúng nhưng nếu public key được gắn với sai identity, ứng dụng vẫn có thể tin nhầm bên.
