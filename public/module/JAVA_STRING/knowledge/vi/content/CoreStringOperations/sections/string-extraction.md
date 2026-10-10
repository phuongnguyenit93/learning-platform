`substring` tạo một String biểu diễn phần văn bản trong một khoảng chỉ số:

```java
String value = "JAVA-21";

value.substring(0, 4); // "JAVA"
value.substring(5);    // "21"
```

Quy tắc khoảng là:

```text
beginIndex được tính
endIndex   không được tính
```

Vì vậy `substring(0, 4)` lấy các chỉ số `0,1,2,3`.

Chỉ số âm, vượt `length()`, hoặc `beginIndex > endIndex` là lỗi phạm vi và dẫn tới `IndexOutOfBoundsException`.

Cũng cần nhớ chỉ số của `String` được tính theo đơn vị mã UTF-16. Không được mặc định dùng `substring(i, i + 1)` để tách một ký tự mà người dùng nhìn thấy trong mọi văn bản Unicode.

Khoảng nửa kín nửa hở giúp tính độ dài đoạn cắt đơn giản:

```text
substring(begin, end)

độ dài đoạn cắt = end - begin
```

Các phạm vi không hợp lệ:

```text
begin < 0
end > length()
begin > end
```
