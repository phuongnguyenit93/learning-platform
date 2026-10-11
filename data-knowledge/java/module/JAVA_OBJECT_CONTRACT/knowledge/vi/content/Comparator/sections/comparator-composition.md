Java cung cấp các phương thức tạo và kết hợp `Comparator` giúp mô tả chính sách sắp xếp theo từng bước.

```java
Comparator<Book> byTitleThenDate =
        Comparator.comparing(Book::title)
                  .thenComparing(Book::publishedAt);
```

### TIÊU CHÍ PHÂN ĐỊNH KHI TIÊU CHÍ TRƯỚC CHO KẾT QUẢ 0 (TIE-BREAKER)

Nếu chỉ sắp xếp theo tiêu đề:

```text
Book("Java", 2022)
Book("Java", 2024)
```

comparator có thể trả `0` dù hai quyển sách là hai đối tượng hoặc giá trị nghiệp vụ khác nhau. Với sắp xếp danh sách, điều này chỉ nói chúng cùng vị trí theo comparator. Với `TreeSet`/`TreeMap`, `compare(...) == 0` còn có thể làm chúng được xem như cùng một khóa theo thứ tự.

Vì vậy tiêu chí phân định khi bằng nhau cần được thiết kế có chủ ý:

```java
Comparator<Book> byTitleThenDateThenId =
        Comparator.comparing(Book::title)
                  .thenComparing(Book::publishedAt)
                  .thenComparing(Book::id);
```

### PHƯƠNG THỨC HỖ TRỢ CHUYÊN BIỆT CHO KIỂU NGUYÊN THỦY

Khi khóa là kiểu nguyên thủy, có thể tránh thao tác đóng hộp (`boxing`) không cần thiết và biểu đạt ý định rõ hơn:

```java
Comparator<Book> byPages =
        Comparator.comparingInt(Book::pages);

Comparator<Book> bySales =
        Comparator.comparingLong(Book::sales);

Comparator<Book> byRating =
        Comparator.comparingDouble(Book::rating);
```

### `reversed()` VÀ THỨ TỰ KẾT HỢP

```java
Comparator<Book> newestFirst =
        Comparator.comparing(Book::publishedAt)
                  .reversed();
```

Cần đọc biểu thức như một chuỗi chính sách. Đặt `reversed()` ở đâu sẽ quyết định phần nào của thứ tự bị đảo, đặc biệt khi kết hợp nhiều comparator.

Ví dụ hai chính sách sau **không giống nhau**:

```java
// Đảo toàn bộ chuỗi: tiêu đề giảm dần, rồi ngày giảm dần.
Comparator<Book> allDescending =
        Comparator.comparing(Book::title)
                  .thenComparing(Book::publishedAt)
                  .reversed();

// Giữ tiêu đề tăng dần, chỉ đảo tiêu chí ngày dùng để phân định khi tiêu đề bằng nhau.
Comparator<Book> titleAscDateDesc =
        Comparator.comparing(Book::title)
                  .thenComparing(
                          Comparator.comparing(Book::publishedAt).reversed()
                  );
```

Vì vậy phép kết hợp phải thể hiện rõ **tiêu chí nào là chính, tiêu chí nào chỉ dùng khi tiêu chí trước bằng nhau, và chính xác phần nào của chính sách bị đảo chiều**. Đảo toàn bộ `Comparator` đã kết hợp không giống với chỉ đảo một bước so sánh bên trong.

### XỬ LÝ NULL LÀ MỘT CHÍNH SÁCH CẦN NÓI RÕ

```java
Comparator<Book> byTitleNullLast =
        Comparator.comparing(
                Book::title,
                Comparator.nullsLast(Comparator.naturalOrder())
        );
```

`nullsFirst` / `nullsLast` giúp đoạn mã sử dụng nói rõ ngữ nghĩa thay vì để `null` gây lỗi bất ngờ.
