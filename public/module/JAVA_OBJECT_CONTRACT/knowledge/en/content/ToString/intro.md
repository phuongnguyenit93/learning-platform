# Text Representation with toString

Not every object contract exists for collections. `toString` is mainly a **human-facing diagnostic contract** used by logs, debuggers, assertion failures, test failures, and ad-hoc textual output.

A useful `toString` helps answer: **which state of this object matters for diagnosis right now?** It should not become a serialization protocol, a security boundary, or a place for expensive business logic.
