# ClassLoader ngữ cảnh của luồng (Thread Context ClassLoader - TCCL)

Cơ chế ủy quyền cho ClassLoader cha tạo ra một hướng nhìn thấy tự nhiên:

```text
ClassLoader con
→ nhìn thấy ClassLoader cha

ClassLoader cha
→ không tự nhiên nhìn thấy class chỉ tồn tại ở ClassLoader con
```

Nhưng nhiều khung phần mềm/thư viện nằm ở phía ClassLoader cha lại cần tìm phần triển khai do ứng dụng hoặc plugin cung cấp ở phía ClassLoader con. Ví dụ một SPI API nằm ở tầng thư viện/nền tảng, còn phần triển khai của thành phần cung cấp nằm trong classpath của ứng dụng.

Nếu các thuật ngữ này còn mới, hãy đọc chúng theo nghĩa rất đơn giản:

```text
SPI (Service Provider Interface)
→ interface/hợp đồng mà thư viện công bố để bên khác triển khai

provider
→ thành phần triển khai SPI

ServiceLoader
→ API JDK dùng để tìm các thành phần cung cấp (provider) đã được khai báo
```

Trong ví dụ xuyên suốt, `Plugin` chính là SPI; `PaymentPlugin` là một thành phần cung cấp (provider).

**Thread Context ClassLoader (TCCL)** tạo một liên kết ClassLoader trên `Thread` để mã đang chạy có thể nói: “đối với thao tác này, hãy dùng ClassLoader phù hợp với ngữ cảnh của bên gọi/ứng dụng để tìm thành phần cung cấp”.
