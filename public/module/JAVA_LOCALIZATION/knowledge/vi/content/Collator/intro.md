# Collator và so sánh theo Locale

Nếu chỉ nhìn mã, ta có thể nghĩ sắp xếp văn bản đơn giản là gọi `String.compareTo`. Nhưng `String.compareTo` so sánh theo thứ tự từ điển của các đơn vị mã UTF-16 (`char`), không nhất thiết trùng với thứ tự chữ cái mà người dùng của một ngôn ngữ mong đợi.

`Collator` tồn tại để thực hiện **so sánh văn bản theo quy tắc ngôn ngữ/Locale**.
