Một leaf certificate thường không được trust trực tiếp. Nó tham gia **certification path** dẫn dần về phía một trust anchor:

~~~text
leaf certificate
    ↓ signed by
intermediate CA
    ↓ issued toward
certificate issued by the trust anchor

trust anchor
    = trusted input được cấu hình riêng
    ≠ certificate nằm trong CertPath
~~~

Peer thường gửi leaf + intermediate chain cần thiết; trust anchor thường đến từ local trust configuration và không nhất thiết phải được peer gửi.

`CertificateFactory`/`CertPath` mô hình hóa certificate/path data; `CertPathBuilder` có thể xây path từ available certificates theo thuật toán/chính sách. Theo convention của Java X.509 `CertPath`, path bắt đầu từ target certificate và kết thúc ở certificate **được trust anchor cấp**, còn certificate đại diện chính trust anchor không được đưa vào `CertPath`.

“Có chain” chưa phải validation. Verifier còn phải kiểm signature, validity, constraints, usage và trust anchor theo PKIX rules.
