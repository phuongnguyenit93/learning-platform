Quy tắc quan trọng nhất:

```text
nếu a.equals(b) == true
→ a.hashCode() phải bằng b.hashCode()
```

Chiều ngược lại không đúng:

```text
cùng mã băm
↛ bắt buộc bằng nhau
```

Hai đối tượng không bằng nhau hoàn toàn có thể xảy ra **va chạm băm (hash collision)** và cho cùng mã băm.

Ngoài ra, khi trạng thái dùng cho phép bằng nhau không đổi, nhiều lần gọi `hashCode()` trong cùng một lần chạy chương trình phải cho kết quả nhất quán theo quy tắc.

Quy tắc không yêu cầu cùng một đối tượng phải giữ nguyên mã băm giữa hai lần chạy JVM khác nhau. Vì vậy không nên lưu `hashCode()` như một mã định danh bền vững rồi kỳ vọng dùng lại ở tiến trình khác.

### `Object.hashCode()` MẶC ĐỊNH

Nếu lớp không ghi đè `hashCode`, phần triển khai kế thừa từ `Object` phù hợp với phép bằng nhau theo định danh mặc định. Nhưng ngay khi bạn thay đổi phép bằng nhau về mặt logic bằng cách ghi đè `equals`, cách băm mặc định có thể không còn phù hợp với quy tắc mới.

Đó là lý do quy tắc thực tế là:

```text
ghi đè equals
→ xem hashCode như cùng một thay đổi thiết kế
```

### TRIỂN KHAI `hashCode` NHƯ THẾ NÀO?

Yêu cầu bắt buộc nằm ở **hành vi**: **mọi cặp đối tượng mà `equals` xem là bằng nhau phải tạo ra cùng mã băm**. Cách đơn giản và dễ kiểm tra nhất là tính `hashCode` từ cùng trạng thái có ý nghĩa đối với phép bằng nhau.

```java
@Override
public int hashCode() {
    return Objects.hash(value);
}
```

Với nhiều trường dữ liệu:

```java
@Override
public int hashCode() {
    return Objects.hash(countryCode, number);
}
```

`Objects.hash` ưu tiên tính dễ đọc; trong đoạn mã chạy rất thường xuyên hoặc nhạy cảm về hiệu năng có thể có cách tính khác. Điều không được thay đổi là sự nhất quán với `equals`.

Quy ước không bắt buộc `hashCode` phải sử dụng **mọi** trường dữ liệu mà `equals` sử dụng. Ví dụ nếu `equals` so sánh `countryCode + number`, một `hashCode` chỉ dựa trên `countryCode` vẫn có thể đúng vì hai đối tượng bằng nhau vẫn luôn có cùng mã băm. Tuy nhiên thiết kế đó thường kém vì nhiều đối tượng không bằng nhau tạo cùng mã băm, khiến cấu trúc dữ liệu phải kiểm tra nhiều ứng viên hơn.

```text
bắt buộc để đúng
→ đối tượng bằng nhau phải có cùng mã băm

hữu ích để phân bố tốt
→ dùng đủ trạng thái liên quan tới phép bằng nhau để phân tán các giá trị không bằng nhau hợp lý
```
