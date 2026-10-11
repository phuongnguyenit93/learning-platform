MemorySegment là abstraction của FFM để biểu diễn **một vùng nhớ liên tục có biên rõ ràng**. Thay vì chỉ giữ một địa chỉ như raw pointer, segment biết kích thước vùng mà nó đại diện, trạng thái lifetime và chính sách truy cập theo luồng.

Trong Java 21 có hai nhóm chính:

- **heap segment**: vùng nhớ nằm trong Java heap, ví dụ segment tạo từ Java array;
- **native segment**: vùng nhớ ngoài Java heap, bao gồm native allocation và mapped segment.

Mapped segment không phải “loại thứ ba” độc lập; nó là native segment được backing bởi file mapping.

Điểm quan trọng là MemorySegment gom ba câu hỏi vốn tách rời ở raw pointer thành một model: vùng nhớ bắt đầu ở đâu, rộng bao nhiêu và còn hợp lệ hay không.
