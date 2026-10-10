# Các mô hình dữ liệu cốt lõi — Map

Sau `List` và `Set`, ta vẫn còn một nhu cầu rất phổ biến mà `Collection<E>` không biểu đạt tốt: tìm một giá trị bằng một **khóa riêng**. Ví dụ, hệ thống có nhiều `Order` nhưng yêu cầu đầu vào thường cung cấp `orderId`. `Map<K, V>` mô hình hóa trực tiếp quan hệ đó.
