Nếu hai đối tượng bằng nhau theo `equals` nhưng trả về mã băm khác nhau, `HashMap`/`HashSet` có thể tìm chúng ở hai vùng khác nhau và không bao giờ đi tới bước so `equals`.

Vì vậy khi ghi đè `equals`, gần như luôn cần xem lại `hashCode` cùng lúc.

```text
equals == true
→ hashCode bắt buộc bằng nhau

hashCode bằng nhau
→ chưa đủ kết luận equals == true
```

### ĐỂ MÃ BĂM BẮT NGUỒN TỪ NGỮ NGHĨA BẰNG NHAU

Thiết kế dễ suy luận nhất là để `hashCode` bắt nguồn từ trạng thái dùng để xác định phép bằng nhau:

```java
final class UserId {
    private final String value;

    UserId(String value) {
        this.value = Objects.requireNonNull(value);
    }

    @Override
    public boolean equals(Object other) {
        return this == other
                || (other instanceof UserId that
                && Objects.equals(value, that.value));
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}
```

Nếu sau này quy tắc bằng nhau đổi từ `value` sang `namespace + value`, `hashCode` cũng phải được xem lại để mọi cặp đối tượng mới được xem là bằng nhau vẫn tạo cùng mã băm. `hashCode` không bắt buộc máy móc phải chứa mọi trường mà `equals` dùng, nhưng bỏ qua quá nhiều trạng thái hữu ích có thể làm tăng va chạm và giảm chất lượng phân bố mã băm.
