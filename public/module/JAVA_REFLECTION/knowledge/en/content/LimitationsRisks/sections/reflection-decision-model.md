After `Class<?>`, member descriptors, dynamic operations, access control, generic metadata, and Dynamic Proxy, the choice can be reduced to a practical sequence of questions:

```text
Is the type/member structure already known at compile time?
    ├─ Yes
    │   ↓
    │ prefer direct calls / interfaces / polymorphism / factories
    │
    └─ No
        ↓
Is runtime discovery genuinely part of the requirement?
    ├─ No
    │   ↓
    │ make the static contract clearer instead of adding reflection
    │
    └─ Yes
        ↓
Can reflection be contained inside a small infrastructure boundary?
    ├─ No
    │   ↓
    │ coupling + runtime failures + maintenance cost rise sharply
    │
    └─ Yes
        ↓
validate early → cache metadata → expose a typed contract
```

Reflection is often justified when several of these conditions hold:

- the concrete type/member is known only at runtime;
- framework or tooling code needs one algorithm for many externally defined types;
- metadata or annotations are a natural part of the integration contract;
- reflective code is concentrated in an adapter, container, serializer, or proxy layer;
- lookup/access/type-mismatch failures are validated and translated into clear framework/domain errors;
- performance is measured on the real workload when reflection lies on a hot path.

Reflection is often a design smell when code already knows the exact type/member but still uses string lookup merely to avoid a direct call, or when `setAccessible(true)` is scattered through application code to bypass an API boundary that has no intentional integration contract.

The whole module can be retained as one final mental model:

```text
WHY
→ work with structure known only at runtime

MODEL
→ Class<?> + member descriptors + Type metadata

MECHANICS
→ discover → inspect → access check → operate

INTEGRATION
→ runtime annotation metadata / Dynamic Proxy / framework tooling

TRADE-OFF
→ compile-time safety / encapsulation / performance / refactorability / native image

DECISION
→ use Reflection only when runtime dynamism is genuinely part of the requirement
```

Reflection is strongest when **dynamism is a real requirement** and the dynamic behavior is kept inside a small, validated, explicit boundary. When the type is already known at compile time, direct Java code usually remains simpler, safer, and easier to maintain.
