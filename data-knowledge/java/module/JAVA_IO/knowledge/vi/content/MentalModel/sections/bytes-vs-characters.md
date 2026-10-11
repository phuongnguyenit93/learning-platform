Máy lưu trữ và truyền dữ liệu vật lý dưới dạng byte. Tuy nhiên, mã ứng dụng thường muốn làm việc với văn bản. Hai nhu cầu này tạo ra hai mức mô hình quan trọng:

```text
dữ liệu nhị phân       văn bản
    ↓                    ↓
mô hình byte          mô hình ký tự
```

**Luồng byte (byte stream)** xem dữ liệu là dãy byte và không tự gán ý nghĩa “chữ” cho chúng. Đây là lựa chọn tự nhiên cho ảnh, ZIP, PDF, dữ liệu mã hóa hoặc bất kỳ định dạng nhị phân nào.

**Luồng ký tự (character stream)** xem dữ liệu là ký tự. Khi ký tự phải đi qua tệp hoặc mạng, cần một **bộ mã ký tự (charset)** để chuyển giữa ký tự Java và byte. Với UTF-8:

```text
ký tự ── mã hóa UTF-8 ──> byte
byte  ── giải mã UTF-8 ──> ký tự
```

Vì vậy không nên lấy một dãy byte tùy ý rồi coi mỗi byte là một ký tự. Một ký tự Unicode có thể cần nhiều byte trong UTF-8, và một `char` Java cũng chỉ là một đơn vị mã UTF-16 (code unit), không phải lúc nào cũng tương ứng với một điểm mã Unicode (code point) hoàn chỉnh.

Ví dụ:

```java
String text = "Xin chào Java ☕";
byte[] utf8 = text.getBytes(java.nio.charset.StandardCharsets.UTF_8);
String restored = new String(utf8, java.nio.charset.StandardCharsets.UTF_8);

System.out.println(text.equals(restored)); // true
```

Luồng byte và luồng ký tự là hai tầng có quan hệ với nhau. Luồng ký tự thường nằm **trên** một nguồn/đích byte và thêm bước mã hóa/giải mã. Chương tiếp theo sẽ bắt đầu từ tầng thấp hơn là `InputStream` và `OutputStream`, sau đó mới đặt `Reader`/`Writer` lên trên.
