Class exposes the same public-versus-declared distinction introduced in the previous chapter:

~~~java
Class<PaymentService> type = PaymentService.class;

Field privateField = type.getDeclaredField("processedCount");
Field publicField = type.getField("CHANNEL");
~~~

getDeclaredField(name) searches fields declared directly by the current class, regardless of visibility. getField(name) searches only public fields and may find an inherited public field.

Example:

~~~java
class BaseService {
    public String region = "VN";
}

class PaymentService extends BaseService {
    private int processedCount = 3;
}
~~~

~~~text
PaymentService.class.getDeclaredField("processedCount")
→ found

PaymentService.class.getField("region")
→ finds the inherited public field

PaymentService.class.getDeclaredField("region")
→ NoSuchFieldException

PaymentService.class.getField("processedCount")
→ NoSuchFieldException because the field is not public
~~~

For enumeration:

~~~java
Field[] declared = PaymentService.class.getDeclaredFields();
Field[] publicSurface = PaymentService.class.getFields();
~~~

Do not rely on the returned array order as a semantic contract. A framework that needs deterministic ordering should define its own rule, such as sorting by name or reading explicit metadata.

Reflection may also expose synthetic fields introduced by the compiler. isSynthetic() lets tooling distinguish such artifacts from source-level fields it actually intends to process. A serializer that blindly handles every declared field can accidentally include state that is not part of the model contract.

A more deliberate filter looks like:

~~~java
static List<Field> instanceFields(Class<?> type) {
    return Arrays.stream(type.getDeclaredFields())
            .filter(field -> !field.isSynthetic())
            .filter(field -> !Modifier.isStatic(field.getModifiers()))
            .toList();
}
~~~
