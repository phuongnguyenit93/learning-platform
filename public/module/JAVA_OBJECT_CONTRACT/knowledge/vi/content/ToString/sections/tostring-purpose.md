Mọi lớp đều kế thừa `toString()` từ `Object` nếu không ghi đè.

### `Object.toString()` MẶC ĐỊNH

Biểu diễn mặc định có dạng gần như:

```text
fully.qualified.ClassName@hexHash
```

Ví dụ:

```text
com.example.UserId@5e2de80c
```

Phần sau dấu `@` đến từ `hashCode()` được biểu diễn ở hệ 16; nó **không phải mã định danh duy nhất của đối tượng** và có thể bị trùng. Biểu diễn mặc định đôi khi hữu ích như một dấu hiệu chẩn đoán thô, nhưng thường không cho ta thấy trạng thái nghiệp vụ quan trọng.

Biểu diễn mặc định của `Object.toString()` không phải một định dạng lưu trữ ổn định để có thể dựa vào giữa các lần chạy JVM. Một lớp hoàn toàn có thể ghi đè `toString()` và chủ đích công bố định dạng ổn định, nhưng đoạn mã sử dụng chỉ nên dựa vào sự ổn định đó khi chính lớp đã nêu rõ cam kết này.

Vì vậy lớp nghiệp vụ thường ghi đè:

```java
@Override
public String toString() {
    return "UserId[value=" + value + "]";
}
```

Kết quả:

```text
UserId[value=U-100]
```

### VÌ SAO `toString` LÀ MỘT QUY ƯỚC?

JDK không bắt buộc một định dạng riêng cố định cho mọi lớp. Ở mức `Object`, `toString` được dùng để trả về biểu diễn văn bản của đối tượng và tài liệu Java khuyến nghị kết quả nên ngắn gọn, có thông tin hữu ích và dễ đọc với con người.

Ngoài kỳ vọng API đó, mã nguồn thực tế thường áp dụng thêm các **nguyên tắc thiết kế** vì `toString` có thể được gọi trong luồng log hoặc gỡ lỗi. Vì vậy một `toString` thực dụng nên:

- phương thức trả về mô tả hữu ích;
- không có tác dụng phụ bất ngờ;
- đủ nhẹ và đủ an toàn để dùng khi gỡ lỗi hoặc ghi log;
- không làm lộ dữ liệu mà đối tượng không nên phơi bày.

Ba ý cuối không phải các luật ngôn ngữ riêng mà Java cưỡng chế. Chúng là nguyên tắc kỹ thuật giúp `toString` an toàn và hữu ích trong môi trường thực tế.

### `toString` CÓ THỂ ĐƯỢC GỌI NGẦM

Bạn không phải lúc nào cũng viết `.toString()` trực tiếp:

```java
System.out.println(userId);

String message = "id=" + userId;

logger.info("processing {}", userId);
```

Các API khác nhau có cách gọi chi tiết riêng, nhưng về mặt mô hình tư duy, biểu diễn của đối tượng có thể xuất hiện ở nhiều nơi ngoài một lời gọi trực tiếp.
