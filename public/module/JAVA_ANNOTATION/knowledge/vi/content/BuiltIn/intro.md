# Các Annotation có sẵn và cách trình biên dịch/công cụ sử dụng chúng

Java cung cấp nhiều Annotation chuẩn. Chương này tập trung vào năm Annotation thường xuyên giúp trình biên dịch kiểm tra **ý định của lập trình viên**: `@Override`, `@Deprecated`, `@SuppressWarnings`, `@SafeVarargs` và `@FunctionalInterface`.

Điểm chung không phải là chúng “chạy cùng một cơ chế”. Mỗi Annotation có quy tắc riêng; có Annotation chủ yếu tồn tại để trình biên dịch kiểm tra, có Annotation còn được công cụ hoặc mã chạy ở thời gian chạy quan sát được.
