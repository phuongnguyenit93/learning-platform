HotSpot có thể tự chọn collector, initial/max heap sizing và runtime compiler policy dựa trên environment và JVM version.

Ví dụ tài liệu Java 21 mô tả các default theo server-class machine và resource heuristics. Nhưng các giá trị này là **hành vi phụ thuộc version/platform**, không phải JVM Specification.

Trong Java 21 HotSpot, Oracle mô tả G1 là default trên server-class machine, Serial GC ở một số cấu hình khác, và tiered compiler dùng C1 + C2 là default compiler policy. Đây là ví dụ để thấy ergonomics thực sự chọn policy; không nên biến các default này thành quy luật vĩnh viễn cho mọi JDK.

Do đó tài liệu production nên ghi:

```text
JDK vendor/version
container/host resources
explicit flags
effective flags/defaults
```

thay vì dựa vào kiến thức “JVM mặc định luôn là X”.

Khi nâng JDK, default hoặc heuristic có thể thay đổi dù code ứng dụng không đổi.

Khi cần xem effective HotSpot flags của đúng runtime đang chạy, có thể dùng một quan sát như:

```text
java -XX:+PrintFlagsFinal -version
```

Output này là bằng chứng cho **runtime cụ thể hiện tại**, không phải specification.
