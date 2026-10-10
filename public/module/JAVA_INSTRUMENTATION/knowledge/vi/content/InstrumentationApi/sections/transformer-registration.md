addTransformer() đăng ký transformer cho các lần định nghĩa class trong tương lai. Overload hai tham số cho phép khai báo transformer có tham gia retransformation hay không:

~~~java
inst.addTransformer(transformer, false);
inst.addTransformer(retransformableTransformer, true);
~~~

Nếu canRetransform=true nhưng JVM không hỗ trợ khả năng này, thao tác đăng ký có thể thất bại.

Về mặt API, cùng một đối tượng transformer có thể được đăng ký nhiều lần, nhưng tài liệu Java khuyến cáo mạnh không làm vậy vì thứ tự thực thi và việc gỡ đăng ký trở nên khó suy luận. Thực tế nên tạo đối tượng riêng khi cần các lượt đăng ký độc lập.

removeTransformer() chỉ gỡ lượt đăng ký gần nhất khớp đối tượng. Nó không rollback những class đã biến đổi, và do quá trình nạp class đa luồng, lời gọi lại vẫn có thể tới transformer sau khi remove đã trả về.

Vì vậy việc quản lý transformer nên có vòng đời rõ:

~~~text
tạo transformer
→ đăng ký
→ sử dụng
→ vô hiệu hóa hành vi nếu cần
→ gỡ đăng ký
→ nếu cần, retransform/redefine các class bị ảnh hưởng để khôi phục
~~~
