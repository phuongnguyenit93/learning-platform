Trong `Repository<T extends Number & Comparable<T>>`, `T` là một `TypeVariable` do class `Repository` khai báo.

```java
TypeVariable<Class<Repository>> variable = Repository.class.getTypeParameters()[0];

System.out.println(variable.getName()); // T

for (Type bound : variable.getBounds()) {
    System.out.println(bound.getTypeName());
}
```

Các giới hạn phản ánh ràng buộc của khai báo:

```text
java.lang.Number
java.lang.Comparable<T>
```

Nếu mã nguồn chỉ viết `<T>` thì giới hạn trên ngầm là `Object`. `TypeVariable` cũng biết khai báo generic nào sở hữu nó qua `getGenericDeclaration()`.

Biến kiểu không chỉ thuộc class. Generic method và generic constructor cũng có thể khai báo biến kiểu riêng vì cả `Method` và `Constructor` đều là `Executable`:

```java
class Converter {
    public <R> R convert(Object source, Class<R> targetType) {
        return targetType.cast(source);
    }
}

Method convert = Converter.class.getMethod(
        "convert",
        Object.class,
        Class.class
);

TypeVariable<Method>[] methodVariables = convert.getTypeParameters();
System.out.println(methodVariables[0].getGenericDeclaration() == convert); // true
```

`getGenericDeclaration()` vì thế cho biết `T`/`R` thuộc khai báo nào, chứ không chỉ cho biết tên của biến kiểu.

Một lỗi tư duy phổ biến là nhìn thấy `T` rồi cố tìm “class thật của T ở lúc chạy”. Reflection đang mô tả **biến kiểu trong khai báo**, không tự động biết một đối tượng cụ thể đã được tạo với `T = Integer` hay `T = Long`.
