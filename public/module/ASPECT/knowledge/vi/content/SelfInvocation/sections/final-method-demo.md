Controller:

```text
SelfInvocationController#finalMethodLimitation()
```

Endpoint:

```text
GET /aop/self-invocation/final-method
```

Method:

```java
@TrackExecution("final-method")
public final String finalTrackedMethod() {
    return "final-method-result";
}
```

`SelfInvocationService` cần class-based proxy vì nó không expose interface business cho proxy strategy này.

Class-based proxy hoạt động bằng subclassing. `final` method không thể override, vì vậy interceptor/advice không thể chen vào method đó.

Response vẫn nhận:

```text
final-method-result
```

nhưng `events` không có:

```text
track-before:label=final-method
```

dù annotation vẫn hiện diện trên method.

Hai fact này không được hard-code. Controller đọc method bằng reflection và kiểm tra trực tiếp:

```text
annotationPresentOnFinalMethod = true
methodIsFinal                  = true
```

Tức là experiment tách rõ hai điều độc lập: annotation thật sự tồn tại, method thật sự là `final`, nhưng advice vẫn không intercept được invocation qua class-based proxy.

Đây là một limitation **khác self-invocation**:

```text
self-invocation
→ call không quay lại proxy

final method với class-based proxy
→ proxy subclass không override method được
```

### Private method

Private method cũng không thể được subclass proxy override. Ngoài ra caller bên ngoài target không thể trực tiếp invoke private method như một business boundary công khai.

Vì vậy module không tạo một endpoint giả tạo bằng reflection chỉ để "ép" private method thành demo; mental model cần nhớ là private method không phải join point phù hợp cho proxy-based Spring AOP.

Hai caveat class-based proxy khác cũng cần nhớ:

```text
final class
→ không thể tạo subclass proxy

package-private method được kế thừa từ parent khác package
→ không thể override/intercept như một method nhìn thấy bình thường từ proxy subclass
```

Demo `finalTrackedMethod()` chỉ return constant để tập trung vào interception. Không nên suy luận rằng gọi mọi final method trên một class-based proxy luôn tương đương một invocation đã đi qua target delegation chain; bản chất limitation là proxy subclass **không override được final method**.

---
