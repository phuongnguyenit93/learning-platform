Consider a runtime annotation intended for service classes:

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

`PaymentService.class.getAnnotation(AuditedComponent.class)` can return the annotation inherited from `BaseService`.

The lookup follows the superclass chain when the annotation type is marked `@Inherited` and the subclass does not already provide the relevant annotation itself.

```text
BaseService declares @AuditedComponent
        ↓ superclass relation
PaymentService
        ↓ Class annotation lookup
inherited annotation can be observed
```

`@Inherited` only has this special meaning for annotations on class declarations. It is not a general rule that copies metadata to every member of every subtype.

### REPEATABLE + INHERITED

A repeatable annotation can also participate in inherited class lookup, but the repeated annotation and its container must be designed consistently. If a repeated annotation type is `@Inherited`, its containing annotation type must satisfy the corresponding inheritance requirement as well.

Use `getAnnotationsByType(...)` when the consumer wants the logical repeated values together with the API's inherited-class behavior.
