Application thường phải trao đổi dữ liệu qua boundary như HTTP API, message, file hoặc external system.

Các boundary đó không thể gửi trực tiếp Java object graph trong memory. Object phải được biểu diễn thành một format có thể truyền/lưu và sau đó dựng lại thành model phía nhận.

Jackson tự động hóa phần lớn quá trình binding giữa Java type và JSON structure.
