# Các cách Java biểu diễn số

Java không có một kiểu số duy nhất phù hợp với mọi bài toán. Mỗi cách biểu diễn đánh đổi giữa **phạm vi giá trị, khả năng biểu diễn chính xác, hiệu năng, bộ nhớ và cách làm tròn**.

Đây là mô hình tư duy quan trọng nhất của mô-đun:

```text
int / long
→ số nguyên nhanh, gọn, chính xác trong phạm vi cố định

float / double
→ phạm vi lớn, phù hợp tính toán khoa học/kỹ thuật,
  nhưng nhiều số thập phân chỉ được biểu diễn gần đúng

BigInteger
→ số nguyên không bị giới hạn bởi độ rộng cố định của kiểu nguyên thủy

BigDecimal
→ số thập phân với giá trị + scale rõ ràng,
  phù hợp khi ngữ nghĩa thập phân và chính sách làm tròn quan trọng
```

Không có cách biểu diễn nào đồng thời cho ta phạm vi vô hạn, số thập phân chính xác tuyệt đối, tốc độ của kiểu nguyên thủy và mức dùng bộ nhớ nhỏ. Vì vậy học Numbers trước hết là học **chọn cách biểu diễn phù hợp với yêu cầu của bài toán**.

Lộ trình:

```text
Vì sao Java cần nhiều cách biểu diễn số?
Các cách Java biểu diễn số
        ↓
Số nguyên độ rộng cố định có thể sai như thế nào?
Số nguyên độ rộng cố định và tràn số
        ↓
Vì sao 0.1 + 0.2 gây bất ngờ?
Số dấu phẩy động và sai số biểu diễn
        ↓
Nếu phạm vi số nguyên không đủ?
Số nguyên phạm vi tùy ý với BigInteger
        ↓
Nếu cần số thập phân chính xác?
Số thập phân chính xác với BigDecimal
        ↓
Độ chính xác (precision), scale và làm tròn trở thành chính sách như thế nào?
Độ chính xác (precision), scale và chính sách làm tròn
        ↓
Vì sao bằng nhau về số học và bằng nhau giữa đối tượng có thể khác nhau?
Quy tắc bằng nhau và thứ tự của giá trị số
        ↓
`Math` cung cấp tiện ích nào?
Tiện ích toán học và phép toán an toàn
        ↓
Sinh số giả ngẫu nhiên và SecureRandom khác nhau ở yêu cầu nào?
Sinh số ngẫu nhiên trong lập trình và yêu cầu bảo mật
        ↓
Cuối cùng chọn cách biểu diễn và chính sách nào?
Chọn mô hình số phù hợp
```

Ba nhóm ví dụ sẽ được dùng xuyên suốt mô-đun:

```text
bộ đếm / số lượng / ID
→ ngữ nghĩa số nguyên và tràn số

cảm biến / đo lường khoa học
→ xấp xỉ dấu phẩy động và sai số chấp nhận

tiền / tỷ lệ / thuế
→ BigDecimal, độ chính xác, scale và chính sách làm tròn
```
