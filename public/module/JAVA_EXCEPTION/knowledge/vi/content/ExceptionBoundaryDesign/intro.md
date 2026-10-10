# Ranh giới xử lý Exception trong ứng dụng

Biết cú pháp `try/catch` chưa đủ để thiết kế luồng xử lý lỗi tốt. Câu hỏi quan trọng hơn là:

```text
Tầng nào có đủ ngữ cảnh
và đủ trách nhiệm
để làm điều có ý nghĩa với lỗi?
```

Một thiết kế Exception tốt giữ được ba thứ cùng lúc:

```text
luồng điều khiển đúng
+ mức trừu tượng đúng
+ đủ thông tin chẩn đoán
```
