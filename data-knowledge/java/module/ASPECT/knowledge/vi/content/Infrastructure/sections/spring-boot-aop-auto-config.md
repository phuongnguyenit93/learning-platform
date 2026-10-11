Module chỉ khai báo:

```groovy
implementation 'org.springframework.boot:spring-boot-starter-aop'
```

và `AspectApplication` không cần tự thêm:

```java
@EnableAspectJAutoProxy
```

Trong Spring Boot, AOP được auto-configure khi dependency và điều kiện phù hợp. Hai setting quan trọng cần biết là:

```text
spring.aop.auto
→ mặc định true

spring.aop.proxy-target-class
→ mặc định true trong Spring Boot
→ ưu tiên class-based/CGLIB proxy
```

Default ở trên là **documented Boot default**, không có nghĩa application bắt buộc phải chứa hai property này trong `application.yml`.

Nếu đổi:

```properties
spring.aop.proxy-target-class=false
```

thì auto-proxy infrastructure có thể dùng JDK dynamic proxy khi target expose interface phù hợp.

Đây là lý do nhiều Spring-managed bean trong module hiện trả:

```text
isCglibProxy = true
```

dù chapter `11.ProxyFactory` vẫn có thể chủ động tạo cả JDK proxy và CGLIB proxy bằng code.
