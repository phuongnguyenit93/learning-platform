# Cơ chế dự phòng của ResourceBundle

Bản địa hóa hiếm khi có một tệp riêng hoàn hảo cho mọi tổ hợp ngôn ngữ-hệ chữ-khu vực. `ResourceBundle` vì vậy có **cơ chế dự phòng (fallback)**: khi tài nguyên cụ thể không tồn tại, Java có thể tiếp tục tra cứu bằng các Locale ứng viên tổng quát hơn hoặc bằng nhánh Locale dự phòng do chính sách tra cứu quy định.

Cơ chế dự phòng hữu ích, nhưng cần hiểu rõ để không nhầm “ứng dụng vẫn chạy” với “bản dịch đã đầy đủ”.

Nói đơn giản, **cơ chế dự phòng (fallback) là chiến lược tiếp tục tra cứu khi tài nguyên phù hợp nhất với Locale yêu cầu không tồn tại**.

Nó tồn tại vì nếu không có cơ chế dự phòng, hệ thống sẽ phải có một tệp hoàn chỉnh cho mọi Locale cụ thể hoặc thất bại ngay khi thiếu một biến thể nhỏ. Cơ chế này cho phép tái sử dụng tài nguyên tổng quát hơn, nhưng đổi lại lập trình viên phải hiểu rõ tài nguyên cuối cùng đến từ đâu.

Các mảnh tham gia vào quá trình này gồm:

```text
Locale yêu cầu
→ Locale người dùng/ngữ cảnh đang yêu cầu

Locale ứng viên
→ các Locale do `ResourceBundle.Control` sinh ra cho một lần tra cứu

Locale mặc định dùng cho dự phòng
→ nhánh tra cứu bổ sung theo chính sách mặc định của ResourceBundle

gói tài nguyên gốc (`base bundle`)
→ tài nguyên không có hậu tố Locale

hành vi khi thiếu tài nguyên
→ chuyện gì xảy ra nếu cuối cùng vẫn không có gói tài nguyên/khóa phù hợp
```
