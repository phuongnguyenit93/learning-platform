Chọn map dựa trên quy ước tra cứu theo khóa và thứ tự:

| Cách triển khai | Thứ tự khóa | tra cứu/put/xóa | Điểm nổi bật |
| --- | --- | --- | --- |
| `HashMap` | Không cam kết thứ tự duyệt | kỳ vọng O(1) | Tra cứu theo khóa đa dụng |
| `LinkedHashMap` | Thứ tự chèn hoặc thứ tự truy cập | kỳ vọng O(1) | Duyệt có thứ tự, có thể xây cache theo thứ tự truy cập |
| `TreeMap` | Sắp theo khóa | O(log n) | Truy vấn phạm vi, đầu/cuối và điều hướng khóa lân cận |

`LinkedHashMap` trong Java 21 là `SequencedMap`, giúp biểu diễn rõ thứ tự duyệt đầu/cuối/đảo ngược. Constructor với `accessOrder=true` còn cho phép thứ tự thay đổi theo lần truy cập, hữu ích cho cấu trúc kiểu LRU khi kết hợp chính sách loại bỏ phù hợp.

Nếu khóa là enum, đừng mặc định dùng `HashMap`. `EnumMap` ở chương tiếp theo thể hiện miền dữ liệu rõ hơn và có cách biểu diễn chuyên biệt.
