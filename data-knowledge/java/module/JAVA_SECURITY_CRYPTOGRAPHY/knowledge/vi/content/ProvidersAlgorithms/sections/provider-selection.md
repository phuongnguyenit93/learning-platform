Nếu gọi `getInstance` chỉ với tên thuật toán, JCA xét các `Provider` theo thứ tự ưu tiên. Đây thường là lựa chọn tốt vì ứng dụng giữ được tính portable:

~~~java
Signature signature = Signature.getInstance("SHA256withRSA");
~~~

Có overload cho phép chỉ định provider name hoặc `Provider` object. Chỉ nên khóa provider khi có **lý do kỹ thuật hoặc compliance rõ ràng**, chẳng hạn cần PKCS#11/HSM cụ thể hoặc tính năng chỉ provider đó cung cấp.

Một điểm quan trọng trong JDK là **delayed provider selection**. Với `Cipher`, `KeyAgreement`, `Mac` và `Signature`, việc gọi `getInstance(...)` không nhất thiết đã chốt provider cuối cùng. JDK có thể đợi đến lúc `init(...)` nhận `Key` để chọn provider có thể xử lý key đó, đặc biệt hữu ích với key không thể export từ token/HSM.

~~~java
Signature signature = Signature.getInstance("SHA256withRSA");
signature.initSign(privateKey); // provider thực tế có thể được chốt tại đây
Provider selected = signature.getProvider();
~~~

Sau khi provider đã được chọn cho instance đó, không nên giả định lần `init(...)` sau sẽ tự chuyển sang provider khác. Nếu cần chọn lại dựa trên một key khác, tạo engine instance mới rồi init lại với key mới.

Hard-code provider không cần thiết làm cách triển khai kém linh hoạt: cùng mã có thể chạy trên JDK/OS khác nhưng provider name hoặc tập service khác nhau.

Khi hành vi cần được kiểm soát, hãy kiểm tra algorithm availability lúc bootstrap và fail rõ ràng, thay vì âm thầm fallback sang một primitive khác.
