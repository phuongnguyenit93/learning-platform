If the class hierarchy already provides a compatible **concrete instance method**, that implementation takes precedence over an interface default:

```java
class Named {
    public String name() {
        return "class";
    }
}

interface NamedContract {
    default String name() {
        return "interface";
    }
}

class CardPayment extends Named implements NamedContract {
}
```

For `new CardPayment().name()`, the implementation from `Named` is used. Interface defaults therefore do not silently replace concrete behavior inherited from the class hierarchy.

One important distinction: if a superclass only declares an abstract method with the same signature, the concrete subclass still has to provide a valid implementation. “Class wins” should not be understood as a runtime choice between two bodies that are always both available.

A class-side `static` method also cannot step aside and let an interface default become the instance implementation. If its signature conflicts with the interface contract, Java reports a compile-time error instead of selecting the default.
