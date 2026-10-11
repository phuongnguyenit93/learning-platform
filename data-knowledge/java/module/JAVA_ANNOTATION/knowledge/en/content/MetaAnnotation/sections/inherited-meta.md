`@Inherited` configures a class annotation type to participate in superclass lookup for applicable runtime annotation queries.

```java
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface AuditedComponent {
}

@AuditedComponent
class BaseService {
}

class PaymentService extends BaseService {
}
```

This is deliberately narrow metadata configuration rather than general-purpose inheritance:

```text
superclass → subclass class-annotation lookup
→ @Inherited can participate

method / field / constructor / parameter / interface
→ not automatically inherited because of @Inherited
```

Runtime visibility still requires suitable retention, normally `RUNTIME`. The Repeatable/Inherited chapter develops the actual lookup APIs, superclass fallback, and method/interface boundaries in detail.
