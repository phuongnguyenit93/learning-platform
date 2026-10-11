Hibernate and JPA are not the same:

```text
JPA
= specification

Hibernate
= implementation/provider + native features
```

Code using only Jakarta Persistence contracts has greater portability; code using Hibernate extensions accepts provider coupling in exchange for provider-specific capabilities.
