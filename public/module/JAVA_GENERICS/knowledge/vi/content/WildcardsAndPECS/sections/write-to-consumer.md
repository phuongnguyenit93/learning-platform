`List<? super Dog>` có thể là:

```java
List<Dog>
List<Animal>
List<Object>
```

Ghi `Dog` là an toàn:

```java
target.add(new Dog());
```

Khi đọc, chỉ có thể chắc chắn:

```java
Object value = target.get(0);
```

Vì list có thể chứa các giá trị khác nếu type thật là `Animal` hoặc `Object`.
