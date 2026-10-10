Not every `Class<?>` has the same meaningful metadata. After identifying a type's **kind**, reflection exposes APIs specialized for that kind.

For arrays, `Class` exposes the immediate component type:

~~~java
Class<?> arrayType = String[][].class;

System.out.println(arrayType.isArray());
System.out.println(arrayType.getComponentType());
System.out.println(arrayType.getComponentType().getComponentType());
~~~

`getComponentType()` returns `null` for a non-array type. A multidimensional array is peeled one dimension at a time because the component type of `String[][]` is `String[]`.

For enums, `getEnumConstants()` returns constants in declaration order:

~~~java
enum PaymentStatus { CREATED, PAID, FAILED }

PaymentStatus[] values = PaymentStatus.class.getEnumConstants();
~~~

For a non-enum type, `getEnumConstants()` returns `null`.

Records have dedicated metadata because a **record component** is a language-level concept, not merely another name for a field or method:

~~~java
record PaymentRequest(String orderId, long amount) {}

for (RecordComponent component : PaymentRequest.class.getRecordComponents()) {
    System.out.println(component.getName());
    System.out.println(component.getType());
    System.out.println(component.getAccessor());
}
~~~

`getRecordComponents()` returns components in record-header order and returns `null` when the type is not a record. `RecordComponent` also exposes generic-type and annotation metadata, allowing serializers and frameworks to reason from the **record contract** rather than reconstructing it indirectly from private fields or accessors.

Sealed classes and interfaces also expose their declared restriction:

~~~java
sealed interface Payment permits CardPayment, BankTransfer {}
final class CardPayment implements Payment {}
final class BankTransfer implements Payment {}

Class<?> paymentType = Payment.class;

if (paymentType.isSealed()) {
    for (Class<?> permitted : paymentType.getPermittedSubclasses()) {
        System.out.println(permitted.getName());
    }
}
~~~

`getPermittedSubclasses()` exposes direct permitted subtypes for a sealed type and returns `null` for a non-sealed type. Reflection observes the declared contract; designing sealed hierarchies remains a type/OOP concern.

~~~text
general Class<?>
    ↓ classify kind
    ├─ array  → component type
    ├─ enum   → enum constants
    ├─ record → record components
    └─ sealed → permitted direct subtypes
~~~
