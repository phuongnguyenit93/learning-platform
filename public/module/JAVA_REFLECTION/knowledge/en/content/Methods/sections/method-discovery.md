Methods are selected by name and parameter types:

~~~java
Method pay = PaymentService.class.getMethod(
        "pay",
        PaymentRequest.class
);

Method internalStatus = PaymentService.class.getDeclaredMethod(
        "internalStatus"
);
~~~

getMethod(...) searches the public method surface and may return an inherited method. getDeclaredMethod(...) searches methods declared directly by the current class at any visibility, but does not automatically search inherited methods.

Example:

~~~java
class BaseService {
    public String serviceId() {
        return "base";
    }
}

class PaymentService extends BaseService {
    private String internalStatus() {
        return "ok";
    }
}
~~~

~~~text
PaymentService.class.getMethod("serviceId")
→ finds the inherited public method

PaymentService.class.getDeclaredMethod("serviceId")
→ NoSuchMethodException

PaymentService.class.getDeclaredMethod("internalStatus")
→ finds the private method descriptor
~~~

For overloaded methods, the parameter-type list is required to select the declaration:

~~~java
class PaymentFormatter {
    String format(long amount) { return Long.toString(amount); }
    String format(String amount) { return amount; }
}

Method a = PaymentFormatter.class.getDeclaredMethod("format", long.class);
Method b = PaymentFormatter.class.getDeclaredMethod("format", String.class);
~~~

int.class and Integer.class are different Class objects:

~~~java
PaymentFormatter.class.getDeclaredMethod("format", Long.class);
// NoSuchMethodException unless a Long overload exists
~~~

Discovery requires the **declared parameter types**. It does not perform compiler-style overload resolution using boxing, widening, or a “closest method” search.

For enumeration:

~~~java
Method[] declared = PaymentService.class.getDeclaredMethods();
Method[] publicMethods = PaymentService.class.getMethods();
~~~

Do not depend on array order. The compiler may also emit synthetic or bridge methods, especially around generic overriding. isSynthetic() and isBridge() let framework code recognize them when its policy needs to filter compiler artifacts.

Public instance methods from superinterfaces may appear through `getMethod()`/`getMethods()`, but `static` interface methods are **not inherited** by implementing classes or subinterfaces. To reflect a static interface method, perform the lookup on the interface that actually declares it.
