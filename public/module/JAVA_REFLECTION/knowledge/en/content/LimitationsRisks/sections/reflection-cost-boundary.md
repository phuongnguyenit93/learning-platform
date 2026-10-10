Reflection gains flexibility by moving decisions from compile time to runtime. The first cost is therefore **reduced compile-time safety**.

~~~java
// Compiler-checked
service.pay(request);

// A typo is discovered only at runtime
service.getClass().getMethod("paay", PaymentRequest.class);
~~~

Reflective code must also handle missing members, wrong receivers, wrong arguments, denied access, and exceptions thrown by the target itself. Earlier chapters already distinguished those failure modes; this final chapter brings them together for design decisions.

The second cost is hidden coupling. IDEs can find references to service.pay(...), while a string such as "pay" in configuration or framework metadata may be invisible to ordinary refactoring tools. Renames therefore need stronger contracts and tests.

The third cost is encapsulation pressure. Reflection still performs access checks. Some APIs can attempt to change reflective accessibility, while JPMS introduces strong-encapsulation boundaries. Access Control covers those rules. The presence of Reflection does not make private meaningless.

The fourth cost is runtime overhead. Metadata lookup and `Method.invoke()`/Field access are generally more expensive than direct calls, although JVMs and frameworks often cache or optimize reflective structures. This cost may be irrelevant during one-time bootstrap and significant inside a hot path. The sections below analyze that trade-off in depth.

A practical decision rule is:

~~~text
Type/member is known at compile time
→ prefer direct calls, interfaces, polymorphism, or factories

The real structure is only known at runtime
and discovering it is part of the requirement
→ Reflection may be appropriate
~~~

When reflection is used, keep the dynamic area narrow: validate metadata early, cache descriptors when reused, translate runtime failures into meaningful framework/domain errors, and keep ordinary business code as type-safe as possible.

This overview puts the major trade-offs into one frame. The following sections separate compile-time safety, encapsulation, performance, native-image concerns, and maintainability before the final decision model.
