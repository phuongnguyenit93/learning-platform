Một cách băm tốt nên kết hợp các trường dữ liệu liên quan tới phép bằng nhau để cấu trúc dữ liệu dựa trên mã băm có thể thu hẹp nhóm ứng viên hiệu quả.

Mục tiêu **không phải tạo mã băm duy nhất cho từng đối tượng**; điều đó không thể bảo đảm trong không gian `int` hữu hạn.

```text
tính đúng đắn
→ đến từ quy tắc equals/hashCode

hiệu năng
→ bị ảnh hưởng bởi chất lượng phân bố mã băm
```

### VA CHẠM BĂM (HASH COLLISION) KHÔNG PHẢI LỖI

Ví dụ hai đối tượng khác nhau hoàn toàn có thể cho cùng mã băm:

```java
final class DemoKey {
    private final int id;

    DemoKey(int id) {
        this.id = id;
    }

    @Override
    public int hashCode() {
        return 1; // cố ý tạo va chạm
    }

    @Override
    public boolean equals(Object other) {
        return other instanceof DemoKey that && id == that.id;
    }
}
```

Cấu trúc dữ liệu dựa trên mã băm vẫn có thể đúng vì sau khi thu hẹp nhóm ứng viên, nó tiếp tục dùng `equals` để phân biệt khóa. Nhưng phân bố tệ khiến quá nhiều ứng viên dồn vào cùng vùng và làm giảm hiệu năng.

### MÃ BĂM KHÔNG PHẢI MÃ ĐỊNH DANH, MÃ THÔNG BÁO BẢO MẬT (TOKEN) HAY GIÁ TRỊ KIỂM TRA (CHECKSUM) MẠNH

Không nên suy diễn:

```text
hashCode khác nhau → nếu quy tắc được giữ, equals không thể là true
hashCode giống nhau → chưa thể kết luận đối tượng bằng nhau
hashCode → dấu vân tay bảo mật?                     sai
hashCode → mã định danh lưu trữ bền vững?           sai
```

Cũng cần tách **định danh tham chiếu** khỏi **mã băm**:

```text
định danh tham chiếu (`==`)
→ hai tham chiếu có đang trỏ tới đúng cùng một đối tượng không?

hashCode()
→ đầu vào để cấu trúc dữ liệu dựa trên mã băm thu hẹp nơi cần tìm kiếm
```

Hai đối tượng có định danh khác nhau vẫn có thể trùng mã băm; ngược lại, hai đối tượng có định danh khác nhau nhưng bằng nhau về mặt logic lại **bắt buộc** phải có cùng mã băm. Vì vậy mã băm không thể dùng để kết luận hai tham chiếu có cùng trỏ tới một đối tượng hay không.

`hashCode` tồn tại chủ yếu để hỗ trợ các cấu trúc dựa trên mã băm theo quy ước của Object trong Java.

Chương tiếp theo ghép `equals` và `hashCode` lại thành **một quy ước vận hành chung** và theo dõi chính xác hậu quả khi hai phương thức không nhất quán.
