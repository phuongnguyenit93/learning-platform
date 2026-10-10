Một đối tượng bất biến thường:

- thiết lập toàn bộ trạng thái trong hàm khởi tạo hoặc phương thức tạo đối tượng;
- không cung cấp phương thức làm thay đổi trạng thái;
- dùng `final` cho trường khi phù hợp;
- không để đối tượng nội bộ có thể thay đổi bị lộ tham chiếu;
- nếu lớp con có thể phá tính bất biến, hạn chế khả năng kế thừa một cách phù hợp.

```java
final class BankAccountSnapshot {
    private final String id;
    private final List<String> tags;

    BankAccountSnapshot(String id, List<String> tags) {
        this.id = id;
        this.tags = new ArrayList<>(tags);
    }

    List<String> tags() {
        return List.copyOf(tags);
    }
}
```

Biến thể bất biến của `BankAccount` này thiết lập toàn bộ trạng thái trong hàm khởi tạo và không trả trực tiếp danh sách nội bộ có thể thay đổi ra ngoài.

Tính bất biến giúp việc dùng chung, lưu đệm, băm và suy luận trong mã đồng thời đơn giản hơn.
