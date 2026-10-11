Ba method public, không `final` của `Object` — `equals`, `hashCode`, `toString` — có hành vi đặc biệt đáng nhớ: khi gọi chúng trên proxy, JDK cũng chuyển lời gọi vào `InvocationHandler.invoke(...)`. `Method.getDeclaringClass()` trong trường hợp này là `Object.class`.

Vì vậy một handler kiểu này nguy hiểm:

```java
return method.invoke(proxy, args);
```

Nó gọi lại method trên chính proxy, proxy lại gọi handler, rồi lặp vô hạn.

Ủy quyền thẳng sang đối tượng đích cũng có thể tạo ngữ nghĩa bất ngờ. Ví dụ `proxy.equals(proxy)` mà handler gọi `target.equals(proxy)` có thể trả `false`, phá kỳ vọng mà thiết kế muốn giữ.

Handler nên quyết định hợp đồng cho ba method này một cách rõ ràng. Ví dụ handler phía trên dùng ngữ nghĩa dựa trên đồng nhất đối tượng (identity) cho `equals/hashCode` và `toString` tùy chỉnh. Một framework khác có thể chọn ngữ nghĩa theo đối tượng đích, nhưng `equals` và `hashCode` phải vẫn giữ hợp đồng tương ứng.

Các method `final` khác của `Object` như `getClass()`, `wait()` hay `notify()` không trở thành điểm chặn lời gọi theo cách ba method trên làm.
