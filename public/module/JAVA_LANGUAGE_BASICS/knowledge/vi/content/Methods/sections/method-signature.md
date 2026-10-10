Trong ngữ cảnh nạp chồng, chữ ký phương thức chủ yếu gồm **tên phương thức + kiểu tham số**. Chỉ khác kiểu trả về thì không đủ để tạo một phương thức nạp chồng khác.

```java
int parse(String value) { return Integer.parseInt(value); }
long parse(String value) { return Long.parseLong(value); } // vẫn không hợp lệ: chỉ khác kiểu trả về
```

Tham số là **biến tham số của từng lần gọi**, nhận bản sao giá trị đối số và có phạm vi sử dụng trong thân phương thức theo quy tắc của Java. `return` kết thúc phương thức và cung cấp kết quả nếu kiểu trả về không phải `void`.

### Cấu trúc của một phương thức

```java
public int add(int left, int right) {
    return left + right;
}
```

Có thể đọc theo thứ tự:

```text
modifier → kiểu trả về → tên phương thức → danh sách tham số → thân phương thức
```

Tham số phương thức khai báo **hợp đồng đầu vào ở mức kiểu**. Kiểu trả về khai báo loại giá trị mà bên gọi nhận lại. `void` nghĩa là phương thức không trả về một giá trị kết quả; nó không có nghĩa phương thức không thể tạo tác dụng phụ.

### Phương thức khác `void` không được kết thúc bình thường mà thiếu giá trị

Nếu phương thức khai báo kiểu trả về khác `void`, trình biên dịch phải chứng minh thân phương thức **không thể kết thúc bình thường mà không trả giá trị**:

```java
int find(boolean found) {
    if (found) {
        return 1;
    }
    // lỗi biên dịch: đường này có thể đi tới cuối phương thức mà không return int
}
```

Sửa bằng cách bảo đảm mọi đường thực thi kết thúc bình thường đều trả giá trị:

```java
int find(boolean found) {
    if (found) {
        return 1;
    }
    return 0;
}
```

Một đường thực thi kết thúc bằng `throw` không cần `return` tiếp theo vì chương trình không kết thúc bình thường trên đường đó:

```java
int requireValue(boolean valid) {
    if (!valid) {
        throw new IllegalStateException("invalid");
    }
    return 1;
}
```

Đây là cùng kiểu **phân tích luồng điều khiển ở thời điểm biên dịch** đã gặp trong definite assignment: trình biên dịch phân tích các đường thực thi, không đoán ý định ở thời điểm chạy.

### `return` kết thúc phương thức hiện tại

`return` không chỉ có thể cung cấp một giá trị trả về; nó còn kết thúc việc thực thi phương thức ngay tại vị trí đó:

```java
if (!valid) {
    return;
}

process(); // chỉ chạy khi valid
```

So với `break` và `continue` đã học ở phần Luồng điều khiển, `return` có phạm vi thoát lớn hơn: nó rời khỏi **toàn bộ phương thức hiện tại**.

Java không cho phép nạp chồng chỉ bằng cách đổi tên tham số hoặc kiểu trả về:

```java
void save(String name) { }
// void save(String value) { } // cùng chữ ký
```
