This distinction is the most important preparation for the Field, Method, and Constructor chapters.

The two API families answer different questions:

~~~text
getDeclaredXxx(...)
→ members declared directly by this class
→ includes public/protected/package-private/private
→ does not automatically include inherited members

getXxx(...)
→ the public view
→ for fields/methods, may include inherited public members
~~~

Example:

~~~java
class BaseService {
    public String serviceName() {
        return "base";
    }
}

class PaymentService extends BaseService {
    private int processedCount;

    private String internalStatus() { return "ok"; }
    public String pay(PaymentRequest request) { return "ok"; }
}
~~~

Conceptually:

~~~text
PaymentService.class.getDeclaredMethod("internalStatus")
→ finds the private method declared by PaymentService

PaymentService.class.getMethod("serviceName")
→ finds the inherited public method from BaseService

PaymentService.class.getDeclaredMethod("serviceName")
→ NoSuchMethodException
~~~

For fields:

~~~text
getDeclaredFields() → fields declared directly, any visibility
getFields()         → public fields on the class + inherited public fields
~~~

For methods:

~~~text
getDeclaredMethods() → methods declared directly, any visibility
getMethods()         → public methods exposed through class/interface hierarchy
~~~

One important exception: `static` interface methods are **not inherited** by implementing classes or subinterfaces. Do not read "public methods through the interface hierarchy" as meaning that every static helper declared on an interface becomes an inherited method of the implementing class; a static interface method belongs to the interface that declares it.

Constructors are different because constructors are **never inherited**:

~~~text
getDeclaredConstructors() → all constructors declared by the class
getConstructors()         → public constructors declared by the class
~~~

Array-returning discovery APIs do not provide a source-order contract that framework logic should depend on. Do not select “the first method” or “the first constructor” as a semantic rule. Select members by explicit criteria such as name, parameter types, annotations, modifiers, or a documented framework policy.

With the type-level map established, the next question becomes state-oriented: **which fields exist, and what metadata describes them?** Reading and writing their values is deferred to the later **Acting Dynamically from Metadata** milestone.
