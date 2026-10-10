After discovery, `get(...)` and `set(...)` operate on a concrete object. Start with a `public` field so the value-access mechanism is observable before access-control rules enter the picture:

~~~java
class Counter {
    public int value = 1;
}

Counter counter = new Counter();
Field publicField = Counter.class.getField("value");

System.out.println(publicField.get(counter)); // 1
publicField.set(counter, 5);
System.out.println(counter.value);            // 5
~~~

Here `publicField` is the descriptor for `value`, while `counter` is the receiver that holds the actual state.

In the running model, `processedCount` is `private`, so discovery can still succeed while value access remains subject to access checks:

~~~java
PaymentService service = new PaymentService("stripe");
Field field = PaymentService.class.getDeclaredField("processedCount");

// These two lines succeed only when reflective access is allowed.
Object value = field.get(service);
field.set(service, 5);
~~~

The split is deliberate: **`getDeclaredField()` finding a member does not mean `get()/set()` is allowed to use it**. Access Control returns to exactly this boundary with `canAccess(...)` and `trySetAccessible()`.

Field.get(...) returns Object. Primitive field values are boxed:

~~~java
int processedCount = (Integer) field.get(service);
~~~

Field also exposes primitive-specific methods such as getInt/setInt and getBoolean/setBoolean:

~~~java
int count = field.getInt(service);
field.setInt(service, 5);
~~~

Static fields belong to the class rather than a particular instance. The receiver argument is ignored for a static field; passing null makes that intention clear:

~~~java
Field channel = PaymentService.class.getField("CHANNEL");
Object value = channel.get(null);
~~~

For an instance field, the receiver must be compatible with the declaring class. A wrong receiver or incompatible value can produce IllegalArgumentException.

Primitive reflective access supports the conversions documented by the Field API, including relevant unboxing/widening cases, but it is not a general conversion system. A String value such as "5" is not automatically parsed into an int.

The useful mental model is:

~~~text
Field descriptor
    +
receiver object (for an instance field)
    +
compatible value (for set)
    ↓
runtime field access
~~~

If the field is private, the existence of the descriptor does not bypass access checks. IllegalAccessException is a normal outcome when the caller does not have reflective access. canAccess(...), trySetAccessible(), and JPMS boundaries are covered in Access Control.
