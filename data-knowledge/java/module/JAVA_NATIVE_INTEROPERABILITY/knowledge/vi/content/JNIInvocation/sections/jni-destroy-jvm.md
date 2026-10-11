DestroyJavaVM bắt đầu vòng đời shutdown của JVM và thực hiện best-effort giải phóng tài nguyên của VM. Nó không đơn giản là “free một object JavaVM”.

Theo JNI Specification, function chờ các **non-daemon thread** khác kết thúc trước khi JVM thực sự shutdown. Nhóm này bao gồm cả Java thread và native thread đã attach dưới dạng non-daemon.

Điều đó có hai hệ quả thực tế:

1. quên detach hoặc để non-daemon work chạy vô hạn có thể làm shutdown bị giữ lại;
2. tài nguyên native phải được giải phóng trước khi thread kết thúc, vì JVM không thể tự giải phóng mọi tài nguyên thuộc native code.

Native thread chưa attach không thuộc vòng đời Java thread theo cùng cách. Sau khi JVM termination bắt đầu, code native còn chạy không được giả định rằng nó có thể quay lại gọi Java an toàn.
