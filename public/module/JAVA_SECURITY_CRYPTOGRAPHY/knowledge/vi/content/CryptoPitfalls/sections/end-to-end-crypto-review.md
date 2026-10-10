Một lần review end-to-end nên đi qua toàn bộ vòng đời thay vì chỉ nhìn một dòng `Cipher.getInstance`:

1. **asset/threat** — đang chống đọc, sửa, giả mạo hay replay?
2. **primitive/protocol** — có standard mechanism phù hợp không?
3. **key origin** — generate, derive, agreement, KEM hay KeyStore?
4. **parameters** — nonce, salt, work factor, transformation, protocol version?
5. **trust** — public key/certificate được xác thực ra sao?
6. **storage/transport** — metadata nào đi cùng ciphertext/signature?
7. **lỗi** — verify/tag/trust lỗi được xử lý thế nào?
8. **rotation/migration** — algorithm/key/version thay đổi sau này bằng cách nào?

Nếu một câu không trả lời được, đó thường là gap thực sự dù code compile và happy-path test đều pass.

Mục tiêu cuối module không phải thuộc mọi class, mà là nhìn được chuỗi reasoning từ mục tiêu bảo mật đến Java mechanism và ranh giới vận hành thực tế.
