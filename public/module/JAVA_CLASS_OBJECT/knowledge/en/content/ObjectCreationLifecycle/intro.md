# Object Creation Process

`new Child()` looks like one expression, but object creation includes allocation, default initialization, constructor chaining, field/block initialization, and finally a usable object. The goal is to distinguish “memory has been allocated” from “construction has successfully established a valid object”.
