KeyAgreement và KEM đều dẫn đến shared secret nhưng interaction model khác:

| | KeyAgreement | KEM |
| --- | --- | --- |
| input chính | private key + peer public key | receiver public/private key + encapsulation |
| output | shared secret | secret key + encapsulation message |
| interaction | thường hai phía có key contribution | sender encapsulate cho receiver |
| Java engine | KeyAgreement | KEM |

Không nên chọn dựa trên “API nào mới hơn”. Protocol specification, khả năng của peer và thiết kế bảo mật mới là những yếu tố quyết định cơ chế.

Cả hai cũng không tự giải quyết certificate trust, identity, replay hay vòng đời khóa. Những vấn đề đó được kết hợp ở lớp protocol.
Shared secret vừa thiết lập thường còn phải đi qua KDF/key schedule hoặc được dẫn xuất từ input khác như password; vì vậy bước kế tiếp là key derivation.
