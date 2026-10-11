Escape analysis cố gắng xác định object allocation có “escape” khỏi phạm vi mà compiler có thể suy luận hay không.

Nếu optimizer chứng minh một object không cần tồn tại như một heap object có thể quan sát được, HotSpot server compiler có thể áp dụng **scalar replacement**: loại allocation khỏi generated code và thay object aggregate bằng các scalar values riêng lẻ.

Ví dụ source:

```java
Point p = new Point(x, y);
return p.x() + p.y();
```

Không nên kết luận `new` trong source luôn đồng nghĩa một heap allocation vật lý tồn tại đến GC. Runtime optimizer có thể thay đổi cách triển khai miễn semantics của chương trình không đổi.

Một hiểu nhầm phổ biến là “escape analysis sẽ chuyển object lên stack”. HotSpot documentation cho Java 21 mô tả **scalar replacement/allocation elimination**, và nêu rõ server compiler không thay heap allocation bằng stack allocation cho object chỉ vì nó không escape.

Đây là lý do “đếm từ khóa `new`” không phải cách đáng tin để suy ra chi phí allocation thực tế.
