Manifest là nơi nối JAR với vòng đời agent. Các attribute chính:

~~~text
Premain-Class
Agent-Class
Launcher-Agent-Class
Can-Redefine-Classes
Can-Retransform-Classes
Can-Set-Native-Method-Prefix
Boot-Class-Path
~~~

Không phải attribute nào cũng cần cho mọi agent. Ví dụ startup agent tối thiểu dùng -javaagent thường chỉ cần Premain-Class. Nếu agent gọi retransformClasses, manifest phải yêu cầu Can-Retransform-Classes: true và JVM cũng phải hỗ trợ khả năng đó.

Manifest là **khai báo nhu cầu**, không phải đảm bảo tuyệt đối. Code runtime vẫn phải kiểm tra khả năng bằng Instrumentation trước khi dùng.
