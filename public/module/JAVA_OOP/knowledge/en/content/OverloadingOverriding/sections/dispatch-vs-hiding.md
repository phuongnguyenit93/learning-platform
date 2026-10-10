Keep this matrix as a mental shortcut:

| Member/call | Main decision point | With `Parent x = new Child()` |
| --- | --- | --- |
| Overloaded method signature | Compile time | based on static argument type |
| Overridden instance-method body | Runtime | may execute `Child` body |
| Hidden static method | Compile time | follows qualifying type `Parent` |
| Hidden field | Compile time | follows expression type `Parent` |

### EVIDENCE — `DispatchController#dispatchVsHiding()`

The experiment returns all of these together:

```text
runtime        = Child
instanceMethod = Child.call
staticMethod   = Parent.staticCall
field          = parent-field
```

One runtime object produces different outcomes across member categories. This directly breaks the misconception that “everything accessed through an object uses dynamic dispatch”.

### RELATION — from dispatch to composition

Inheritance + overriding are powerful, but deeper hierarchies increase coupling. If the goal is merely to vary behavior, **composition** often lets us replace a collaborator without extending the consumer's hierarchy.
