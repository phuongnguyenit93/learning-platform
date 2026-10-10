Hai kiểm tra khác nhau:

1. **trust validation**: certificate/path có được trust theo CA/chính sách trust anchor không;
2. **identity verification**: certificate có đại diện đúng endpoint/hostname mà ứng dụng định kết nối không.

Một certificate được CA tin cậy nhưng cấp cho attacker.example không nên được chấp nhận cho api.example.

TLS client thường cần cả hai. JSSE/HTTP layer có endpoint identification logic dựa trên hostname/SAN. Custom TrustManager trả true cho mọi certificate hoặc custom HostnameVerifier luôn true làm mất một phần security contract.

Trust nói “tôi tin issuer/path này”; identity nói “key này thuộc đúng peer tôi muốn nói chuyện”.
Khi key material, certificate path, trust và endpoint identity đã rõ, các mảnh này có thể được ghép lại trong secure-channel model của JSSE/TLS.
