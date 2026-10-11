Quy tắc vừa thấy với `Box<T>` áp dụng tương tự cho `List<T>`:

```java
class Animal {}
class Dog extends Animal {}

List<Dog> dogs = new ArrayList<>();
// List<Animal> animals = dogs; // compile error
```

Dù `Dog <: Animal`, không có quan hệ:

```text
List<Dog> <: List<Animal>
```

Đây là **cùng một quy tắc invariance**, chỉ được đặt vào `List` để chuẩn bị cho Wildcard/PECS ở chương sau.
