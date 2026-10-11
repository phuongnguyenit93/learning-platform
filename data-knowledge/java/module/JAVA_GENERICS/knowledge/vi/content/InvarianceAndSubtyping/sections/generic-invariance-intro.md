Giả sử:

```java
class Animal {}
class Dog extends Animal {}
```

`Dog` là subtype của `Animal`, nhưng:

```java
Box<Dog> dogs = new Box<>();
// Box<Animal> animals = dogs; // compile error
```

`Box<Dog>` **không** tự động là subtype của `Box<Animal>`.

Lý do trực giác:

```java
Box<Animal> animals = dogs; // giả sử được phép
animals.set(new Animal());  // hợp lệ theo Box<Animal>
```

Khi đó một `Box<Dog>` lại có thể chứa `Animal` không phải `Dog`, phá vỡ đảm bảo ban đầu.

Đây là **tính bất biến (invariance)**. Chương Wildcard tiếp theo sẽ cung cấp cách diễn tả quan hệ linh hoạt hơn mà không phá an toàn kiểu.
