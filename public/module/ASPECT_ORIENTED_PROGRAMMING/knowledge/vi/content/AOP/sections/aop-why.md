Nếu cùng một concern phải xuất hiện ở rất nhiều nơi, code business dễ bị lặp và bị trộn với logic không thuộc domain chính.

Ví dụ một hệ thống có hàng chục use case đều cần đo thời gian và ghi audit. Nếu mỗi method tự viết lại cùng một đoạn logic, việc thay đổi policy sau này trở nên khó và dễ thiếu nhất quán.
