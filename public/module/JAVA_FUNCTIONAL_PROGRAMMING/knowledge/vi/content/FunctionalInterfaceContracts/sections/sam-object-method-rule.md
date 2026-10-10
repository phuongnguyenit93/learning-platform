Một giao diện có thể khai báo lại phương thức có chữ ký tương ứng với **phương thức thực thể `public` của `Object`**, chẳng hạn `equals(Object)`. Khai báo như vậy không tạo thêm một hợp đồng trừu tượng cần được lambda triển khai.

```java
@FunctionalInterface
interface Matcher {
    boolean matches(String value);

    @Override
    boolean equals(Object other);
}
```

`Matcher` vẫn có thể là giao diện hàm vì `equals(Object)` tương ứng với phương thức `public` của `Object`, còn `matches` là hợp đồng hàm thực sự.

Không nên mở rộng quy tắc này thành "mọi phương thức có tên giống phương thức trong Object đều bị bỏ qua". Quy tắc dựa trên chữ ký của các phương thức thực thể `public` tương ứng của `Object`, không chỉ dựa vào tên quen thuộc như `clone` hay `finalize`.
