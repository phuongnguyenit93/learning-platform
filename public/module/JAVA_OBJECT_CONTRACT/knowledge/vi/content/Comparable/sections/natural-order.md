`Comparable<T>` yêu cầu kiểu dữ liệu cung cấp:

```java
int compareTo(T other);
```

`Comparable` công bố một **thứ tự toàn phần (total order)** cho các giá trị hợp lệ của kiểu dữ liệu: với hai giá trị có thể so sánh, quan hệ thứ tự phải xác định chúng đứng trước, đứng sau hoặc cùng vị trí. Thứ tự tự nhiên nên là cách sắp xếp mặc định mà người dùng của kiểu dữ liệu có thể dự đoán hợp lý.

Ví dụ một `Version` có thể có thứ tự tự nhiên theo:

```text
major
  ↓ nếu bằng nhau
minor
  ↓ nếu bằng nhau
patch
```

```java
record Version(int major, int minor, int patch)
        implements Comparable<Version> {

    @Override
    public int compareTo(Version other) {
        int byMajor = Integer.compare(major, other.major);
        if (byMajor != 0) return byMajor;

        int byMinor = Integer.compare(minor, other.minor);
        if (byMinor != 0) return byMinor;

        return Integer.compare(patch, other.patch);
    }
}
```

### KHI NÀO KHÔNG NÊN CÓ THỨ TỰ TỰ NHIÊN?

Nếu một kiểu dữ liệu có nhiều cách sắp xếp ngang nhau về ý nghĩa, việc tùy ý chọn một cách làm thứ tự tự nhiên có thể gây bất ngờ.

Ví dụ `Book` có thể sắp xếp theo tiêu đề, ngày xuất bản, giá hoặc đánh giá. Không cách nào hiển nhiên là “bản chất tự nhiên duy nhất” của `Book`. Khi đó `Comparator` thường phù hợp hơn.
