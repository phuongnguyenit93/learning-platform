Mental model:

```text
Caller
  ↓
Spring AOP Proxy
  ↓
Advice chain
  ↓
Target Object
```

Khi một bean cần AOP, Spring thường đưa cho consumer một proxy thay vì reference trực tiếp tới target object.

Proxy có thể được tạo theo các chiến lược khác nhau như JDK dynamic proxy hoặc class-based proxy. Không nên hardcode assumption rằng mọi bean luôn dùng cùng một loại proxy.

Điều quan trọng hơn loại proxy là:

```text
invocation có đi qua proxy hay không?
```
