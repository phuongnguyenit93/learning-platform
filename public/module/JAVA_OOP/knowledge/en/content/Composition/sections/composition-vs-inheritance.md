The mechanisms model different kinds of relationships:

| Question | Inheritance | Composition |
| --- | --- | --- |
| Primary relationship | is-a | has-a / collaborates-with |
| Reuse | inherited implementation | delegation |
| Variation | subtype override | replace collaborator |
| Coupling | tight to base class | tight to collaborator contract |
| Runtime swap | usually less natural | natural when collaborator is injected |

### Decision heuristic

If an object **truly must be usable as the supertype**, inheritance may be right. If the goal is only to reuse or swap behavior, consider composition first.

“Favor composition over inheritance” does not mean “never use inheritance”; it warns against using inheritance as a shortcut for code reuse without subtype semantics.
