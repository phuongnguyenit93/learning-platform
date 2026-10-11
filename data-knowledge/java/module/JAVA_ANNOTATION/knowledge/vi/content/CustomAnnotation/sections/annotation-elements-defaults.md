Phần tử không có giá trị mặc định là bắt buộc. Giữ nguyên ví dụ xuyên suốt: `action` không có giá trị mặc định nên bắt buộc, còn `level` có giá trị mặc định nên có thể bỏ qua khi sử dụng:

```java
public @interface Audit {
    String action();
    int level() default 1;
}
```

Cách sử dụng tối thiểu chỉ cần cung cấp `action`:

```java
@Audit(action = "TRANSFER")
```

Có thể khai báo giá trị mặc định:

```java
public @interface Audit {
    String action();
    int level() default 1;
}
```

Khi đó:

```java
@Audit(action = "TRANSFER")
```

sẽ dùng `level = 1`.

Phần tử dạng mảng cũng có thể có giá trị mặc định. Ví dụ:

```java
public @interface Labels {
    String[] value() default {};
}
```

### Giá trị mặc định không phải `default method`

Từ khóa `default` ở phần tử Annotation chỉ định **giá trị siêu dữ liệu mặc định**, không có ngữ nghĩa giống `default method` của interface thường.

Một chi tiết quan trọng: giá trị mặc định thuộc kiểu Annotation, không được sao chép trực tiếp vào từng vị trí sử dụng Annotation thiếu giá trị đó. Khi Annotation được đọc, giá trị mặc định hiện tại của kiểu Annotation được áp dụng. Vì vậy thay đổi giá trị mặc định có thể thay đổi giá trị quan sát được từ class đã biên dịch trước đó nếu nơi sử dụng không ghi giá trị tường minh.

Đây là lý do giá trị mặc định cũng là một phần của **quy tắc tương thích**.

Phần tử Annotation không nhận `null`. Nếu cần trạng thái “không có giá trị”, hãy thiết kế giá trị mặc định/giá trị đặc biệt có nghĩa rõ ràng, ví dụ:

```java
// Ví dụ giá trị đặc biệt nếu miền nghiệp vụ thật sự cần:
// enum AuditLevel { DEFAULT, LOW, HIGH }
```

Tránh các giá trị đặc biệt khó hiểu như `"N/A"` hoặc `-1` nếu thành phần đọc phải tự đoán ngữ nghĩa.
