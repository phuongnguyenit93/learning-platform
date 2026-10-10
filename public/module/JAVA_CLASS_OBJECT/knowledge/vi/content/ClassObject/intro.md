# Lớp (class) và đối tượng (object)

Java dùng `class` để mô tả **một loại thực thể có trạng thái và hành vi chung**, còn `object` là một đối tượng cụ thể được tạo khi chương trình chạy. Cách tổ chức này giúp dữ liệu đi cùng với những hành vi và quy tắc chịu trách nhiệm bảo vệ dữ liệu đó, thay vì để các giá trị và thao tác liên quan tồn tại rời rạc.

Trong mô-đun này, hãy giữ mô hình `BankAccount` làm ví dụ xuyên suốt: lớp định nghĩa cấu trúc và quy tắc chung; mỗi đối tượng tài khoản có danh tính và trạng thái riêng. Các chương sau tiếp tục cùng mô hình đó khi học khởi tạo, quá trình tạo đối tượng, sao chép, dùng chung tham chiếu và tính bất biến.

Mạch học của phần Kiến thức bám theo lộ trình như sau. Chặng về khởi tạo được triển khai qua ba chương riêng để tách rõ cơ chế, thứ tự và toàn bộ quá trình tạo đối tượng:

```text
Lớp khác đối tượng thế nào?
Lớp và đối tượng
        ↓
Đối tượng được tạo với trạng thái hợp lệ bằng cách nào?
Hàm khởi tạo và trạng thái hợp lệ
        ↓
this / super đại diện cho ngữ cảnh nào?
this, super và chuỗi khởi tạo
        ↓
Ai được phép truy cập thành viên?
Phạm vi truy cập thành viên
        ↓
Thành viên nào thuộc lớp, thành viên nào thuộc từng đối tượng?
Thành viên cấp lớp, thành viên cấp đối tượng và final
        ↓
Khởi tạo lớp và từng đối tượng diễn ra ở đâu, theo thứ tự nào?
Khối khởi tạo → Thứ tự khởi tạo → Quá trình tạo đối tượng
        ↓
Lớp lồng nhau và lớp nội bộ giữ ngữ cảnh gì?
Lớp lồng nhau và lớp nội bộ
        ↓
Mọi lớp Java thông thường có lớp gốc chung nào?
Object – lớp gốc chung
        ↓
Một tập giá trị hữu hạn có kiểu rõ ràng được mô hình hóa ra sao?
Kiểu liệt kê (enum)
        ↓
Sao chép đối tượng thực sự sao chép điều gì?
Cách sao chép đối tượng
        ↓
Nhiều tham chiếu tới cùng một đối tượng có thể thay đổi gây gì?
Dùng chung tham chiếu và trạng thái có thể thay đổi
        ↓
Làm sao tạo đối tượng an toàn hơn khi chia sẻ?
Tính bất biến và sao chép phòng vệ
        ↓
Làm sao nối toàn bộ các khái niệm thành một mô hình thống nhất?
Tổng hợp mô hình lớp và đối tượng
```

Các thuật ngữ chính liên hệ với nhau như sau:

```text
class
→ định nghĩa kiểu, cấu trúc trạng thái và hành vi

đối tượng / object / instance
→ một thực thể cụ thể tồn tại khi chương trình chạy

hàm khởi tạo / constructor
→ khai báo đặc biệt tham gia quá trình tạo đối tượng và thiết lập trạng thái ban đầu

khởi tạo / initialization
→ quá trình thiết lập giá trị hoặc trạng thái ban đầu cho lớp hay đối tượng

this / super
→ biểu diễn ngữ cảnh của đối tượng hiện tại và lớp cha

static / instance
→ phân biệt trạng thái/hành vi thuộc lớp với trạng thái/hành vi thuộc từng đối tượng

tham chiếu / dùng chung tham chiếu / sao chép / tính bất biến
→ giải thích đối tượng được tham chiếu, dùng chung, sao chép hoặc bảo vệ khỏi thay đổi như thế nào
```
