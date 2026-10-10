A useful custom annotation has a narrow, explainable consumer contract. Before creating one, answer four questions:

1. **Who consumes it?** Compiler plugin, annotation processor, framework, runtime reflection, documentation tool?
2. **What decision does it affect?** Validation, registration, generation, routing, auditing, serialization?
3. **Where should it be legal?** Class, method, field, type use, record component, or another location?
4. **How long must it survive?** Source only, class file, or runtime?

For the running example, suppose a runtime auditing component reads methods:

```java
@Audit(action = "PAYMENT", level = 2)
void pay() {
}
```

That design immediately suggests later choices:

```text
runtime consumer
→ likely RUNTIME retention

method-level auditing contract
→ METHOD target

action + level describe the audit decision
→ explicit elements with stable semantics
```

The next question for `@Audit` is temporal: **how long must this metadata survive so its intended consumer can still see it?** That is the job of retention policy.
