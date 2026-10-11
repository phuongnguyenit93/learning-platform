Một kiểu có **thứ tự tự nhiên** khi chính kiểu đó định nghĩa cách so sánh các đối tượng của nó, thường qua `Comparable<T>` và `compareTo`. Thứ tự tự nhiên nên biểu diễn một thứ tự có ý nghĩa tương đối ổn định đối với bản thân kiểu, không phải một tiêu chí tạm thời của một màn hình hoặc báo cáo.

Ví dụ, nếu `Order` coi `id` là thứ tự tự nhiên:

```java
record Order(long id, long userId, int totalCents)
        implements Comparable<Order> {

    @Override
    public int compareTo(Order other) {
        return Long.compare(this.id, other.id);
    }
}

List<Order> orders = new ArrayList<>(List.of(
        new Order(3, 2, 10_000),
        new Order(1, 1, 20_000),
        new Order(2, 3, 10_000)
));

orders.sort(null); // null => dùng thứ tự tự nhiên
```

Thứ tự tự nhiên cũng là mặc định của nhiều cấu trúc cần thứ tự như `TreeSet`, `TreeMap` hoặc `PriorityQueue` khi không truyền `Comparator` riêng.

Một quy tắc thực tế là: `compareTo` nên tạo ra quan hệ so sánh nhất quán và bắc cầu. Với Set/Map có sắp xếp, việc thứ tự tự nhiên không nhất quán với `equals` có thể làm khái niệm “trùng” của collection khác với trực giác dựa trên `equals`. Hệ quả này được giải thích sâu hơn ở chương tính bằng nhau/hash; quy ước `equals/hashCode` tự thân thuộc module **Quy ước của Object** (`object-contract`).
