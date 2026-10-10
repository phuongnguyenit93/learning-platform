Major structural changes are restricted, including attempts to:

- add/remove fields;
- add/remove methods;
- change method signatures;
- change class, field, or method modifiers;
- change superclass or implemented interfaces;
- rename the class.

Turning:

~~~java
class OrderService {
    void placeOrder() { ... }
}
~~~

into:

~~~java
class OrderService extends NewBase {
    long agentState;
    void placeOrder(String id) {}
}
~~~

is not the kind of change redefine/retransform should be expected to support.

Agents usually alter **existing method bodies** or call external helper code so object layout remains stable.
