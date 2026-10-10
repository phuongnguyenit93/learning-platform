The three mechanisms act at different layers:

| Mechanism | Intervention point | Natural fit |
| --- | --- | --- |
| Reflection | runtime metadata/member access | inspect/invoke when type/member is selected dynamically |
| Proxy/AOP | calls crossing a wrapper/interceptor boundary | cross-cutting behavior at interface/bean/framework boundaries |
| Instrumentation | class-file definition/bytecode | inject/replace logic regardless of whether calls cross a proxy |

For OrderService:

~~~text
read @Timed annotation
→ Reflection

intercept a call through a Spring proxy
→ Proxy/AOP

instrument the method even when object is created directly
→ Instrumentation
~~~

They can also cooperate: an agent may inspect metadata through reflection and then use Instrumentation to alter bytecode.
