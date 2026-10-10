`ArrayList` là lựa chọn mặc định tốt cho phần lớn chuỗi dữ liệu cần chỉ số và duyệt:

- `get(index)`: O(1).
- thêm cuối: amortized O(1).
- chèn/xóa giữa List: O(n) vì phải dịch phần tử.
- dữ liệu nằm liên tục trong mảng nền nên thường có tính cục bộ bộ nhớ tốt.

`LinkedList` dùng các nút liên kết hai chiều:

- `get(index)`: O(n).
- thêm/xóa ở đầu/cuối: O(1).
- thêm/xóa tại vị trí **sau khi đã có nút/iterator ở vị trí đó**: liên kết lại nút là O(1).
- mỗi phần tử tốn thêm tham chiếu cho liên kết và có tính cục bộ bộ nhớ kém hơn mảng.

Vì vậy “nhiều thao tác chèn” chưa đủ để chọn `LinkedList`. Nếu mỗi lần chèn bắt đầu bằng `get(i)` hoặc duyệt từ đầu, chi phí tìm vị trí vẫn là O(n). Nếu kiểu sử dụng chủ yếu là thêm cuối, duyệt và truy cập ngẫu nhiên, `ArrayList` thường phù hợp hơn.

Nếu nhu cầu thực sự là thêm/xóa ở hai đầu, hãy xem `Deque`; `ArrayDeque` thường diễn đạt ý định đó trực tiếp hơn.
