Use this sequence of questions:

```text
Does the consumer only need a common contract/capability?
→ prefer an interface

Does a closely related class family share state + initialization rules + base implementation?
→ consider an abstract class

Does one class need several independent roles?
→ implement several interfaces

Do we need a flexible public contract while one implementation branch still shares code/state?
→ interface + abstract base class

Do interfaces need to compose smaller contracts?
→ interface inheritance

Does an interface need default instance behavior?
→ use default

Does it need an operation owned by the interface type itself?
→ use static

Does it need internal implementation reuse?
→ use private / private static

Do inherited defaults compete?
→ apply specificity, class-hierarchy precedence, and explicit override rules
```

The mechanism should follow from the **modeling need**, not from syntax familiarity.
