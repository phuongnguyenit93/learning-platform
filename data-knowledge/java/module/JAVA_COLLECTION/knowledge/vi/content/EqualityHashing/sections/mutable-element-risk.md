Collection dựa trên hash và collection có sắp xếp giả định rằng thuộc tính quyết định vị trí của khóa/phần tử không tự thay đổi trong lúc nó đang được lưu.

Xét một khóa có thể thay đổi:

```java
final class UserKey {
    long id;
    String region;

    UserKey(long id, String region) {
        this.id = id;
        this.region = region;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof UserKey that)) return false;
        return id == that.id && Objects.equals(region, that.region);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, region);
    }
}

UserKey key = new UserKey(10, "VN");
Map<UserKey, String> names = new HashMap<>();
names.put(key, "Phuong");

key.region = "SG"; // thay đổi dữ liệu tham gia hashCode/equals

System.out.println(names.get(key)); // không còn được đảm bảo tìm thấy entry
```

Entry không tự di chuyển sang bucket tương ứng với hash mới. Tương tự, nếu phần tử trong `TreeSet` thay đổi trường mà comparator đọc, cây không tự sắp xếp lại; thứ tự và tra cứu có thể không còn hợp lệ.

Cách an toàn thường là dùng khóa có định danh ổn định, ưu tiên đối tượng bất biến cho khóa, hoặc xóa phần tử trước khi thay đổi thuộc tính định vị rồi chèn lại. Việc thay đổi **giá trị** của `Map` không gây cùng loại rủi ro nếu giá trị không tham gia định danh của khóa, dù các bất biến nghiệp vụ của ứng dụng vẫn phải được giữ riêng.
