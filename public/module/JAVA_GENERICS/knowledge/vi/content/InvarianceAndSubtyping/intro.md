# Tính bất biến và quan hệ kiểu con

Đây là một trong những chỗ dễ gây khó chịu nhất khi mới học Generics. Ta đã biết:

```java
Dog dog = new Dog();
Animal animal = dog; // hoàn toàn hợp lệ
```

`Dog` là subtype của `Animal`. Câu hỏi mới là: **quan hệ đó có tự động truyền qua một kiểu generic hay không?**

Java vì thế làm kiểu generic **bất biến (invariant) theo mặc định**:

```text
Dog là subtype của Animal
không kéo theo
Box<Dog> là subtype của Box<Animal>
```

Wildcard là công cụ sẽ được học ở chương sau để mở lại đúng phần linh hoạt mà API thật sự cần mà không phá đảm bảo này.
