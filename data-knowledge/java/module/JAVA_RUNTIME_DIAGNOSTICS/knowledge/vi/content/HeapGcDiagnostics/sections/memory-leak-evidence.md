Giả thuyết memory leak nên được xây theo chuỗi:

~~~text
symptom: memory tăng
   ↓
post-GC live set có tăng?
   ↓
class histogram nào tăng?
   ↓
heap dump cho thấy object bị giữ bởi ai?
   ↓
Bằng chứng allocation/old-object từ JFR chỉ về chuỗi lời gọi nào?
~~~

Bằng chứng mạnh thường gồm:

- object population tăng qua thời gian;
- retained graph dẫn về long-lived root;
- workload không giải thích được mức tăng;
- sau full/major collection live set không giảm như mong đợi.

Tránh kết luận “class X leak” chỉ vì X có nhiều instance. Leak thực tế có thể do một cache hoặc listener sống lâu giữ reference đến X.

Nếu mức tăng nằm ngoài Java heap, chuyển sang chẩn đoán NMT/native memory.
