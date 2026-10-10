`LocalTime` có các trường:

```text
giờ
phút
giây
nano giây trong giây
```

Ví dụ:

```java
LocalTime precise = LocalTime.of(9, 30, 15, 123_456_789);
```

Điều này nghĩa là API **có khả năng biểu diễn** tới nano giây, không có nghĩa hệ điều hành, cơ sở dữ liệu hay đồng hồ thực tế của máy luôn đo được chính xác tới nano giây.

Đây là điểm phân biệt quan trọng:

```text
độ chính xác khi biểu diễn
≠
độ chính xác / độ phân giải khi đo
```

Khi lưu trữ hoặc giao tiếp qua mạng, luôn kiểm tra độ chính xác mà hệ thống đích hỗ trợ. Một cột cơ sở dữ liệu chỉ giữ micro giây/mili giây có thể làm mất phần nano giây.

Các hằng số hữu ích:

```java
LocalTime midnight = LocalTime.MIDNIGHT; // 00:00
LocalTime noon = LocalTime.NOON;         // 12:00
```

Đọc trường:

```java
int hour = precise.getHour();
int minute = precise.getMinute();
int second = precise.getSecond();
int nano = precise.getNano();
```
