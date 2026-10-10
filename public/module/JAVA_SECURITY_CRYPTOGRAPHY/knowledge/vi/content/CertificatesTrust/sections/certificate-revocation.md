Certificate có thể còn trong validity period nhưng private key đã bị compromise hoặc CA đã revoke certificate. Revocation checking giúp verifier xem trạng thái đó qua cơ chế như CRL/OCSP tùy PKIX configuration/provider.

Java CertPathValidator có thể cung cấp PKIXRevocationChecker để cấu hình option chi tiết.

Revocation có operational trade-off: network availability, cache, chính sách soft-fail/hard-fail và freshness đều ảnh hưởng hành vi. Không có một setting phù hợp cho mọi hệ thống.

Quan trọng là **quyết định chính sách xử lý lỗi có chủ đích**. Tắt revocation chỉ để hết lỗi certificate có thể biến incident signal thành trust bypass.
