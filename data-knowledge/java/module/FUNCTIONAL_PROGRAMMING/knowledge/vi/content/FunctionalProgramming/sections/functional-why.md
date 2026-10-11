Khi logic phụ thuộc nhiều vào shared mutable state, kết quả của một đoạn code có thể bị ảnh hưởng bởi những thay đổi xảy ra ở nơi khác và vào thời điểm khác.

Functional Programming cố giảm loại phụ thuộc đó bằng cách ưu tiên function có input/output rõ ràng, hạn chế side effect và khuyến khích immutable data.
