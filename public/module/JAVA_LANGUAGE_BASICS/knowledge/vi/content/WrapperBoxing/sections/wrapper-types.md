Mỗi kiểu nguyên thủy có kiểu bao tương ứng:

```text
byte    ↔ Byte
short   ↔ Short
int     ↔ Integer
long    ↔ Long
float   ↔ Float
double  ↔ Double
char    ↔ Character
boolean ↔ Boolean
```

Kiểu bao là đối tượng bất biến với ngữ nghĩa giá trị riêng. Vì là kiểu tham chiếu, kiểu bao có thể là `null`, tham gia API generic và có tính đồng nhất đối tượng khác với giá trị nguyên thủy.

### Vì sao kiểu bao tồn tại?

Nhiều API Java cần **kiểu tham chiếu**, trong khi kiểu nguyên thủy không phải đối tượng. Tham số kiểu generic là ví dụ quen thuộc:

```java
List<Integer> numbers = new ArrayList<>();
// List<int> không hợp lệ
```

Kiểu bao còn cung cấp API tiện ích như parse, chuyển đổi và các hằng:

```java
int value = Integer.parseInt("42");
Integer boxed = Integer.valueOf(42);
```

Khi API không cần ngữ nghĩa đối tượng/có thể `null`, kiểu nguyên thủy thường đơn giản hơn và tránh chi phí cấp phát/boxing không cần thiết.
