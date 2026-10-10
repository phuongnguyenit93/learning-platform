# Class and Object Model

Java uses a `class` to describe **a kind of object with state and behavior**, while an `object` is a real runtime instance. This lets Java keep data together with the operations and rules that are responsible for that data instead of treating every value as unrelated global state.

Keep a small running example such as `BankAccount`: the class defines shared structure and rules; each account object has its own identity and state. Later chapters evolve the same mental model through construction, initialization, copying, aliasing, and immutability.

The Knowledge path follows the approved roadmap. The initialization milestone expands into three chapters so mechanisms, ordering, and the full creation process stay separately navigable:

```text
How do class and object differ?
Class and Object Model
        ↓
How is a valid object created?
Construction and Valid State
        ↓
What do this / super mean?
this, super, and Construction Chains
        ↓
Who may access which members?
Member Access Control
        ↓
Which members belong to the class vs each instance?
Class Members, Instance Members, and final
        ↓
Where and in what order does initialization happen?
Initialization Blocks → Initialization Order → Object Creation Process
        ↓
What context can nested/inner classes capture?
Nested and Inner Types
        ↓
What common root class does every ordinary Java class inherit from?
Object as the Common Root Class
        ↓
How does Java model a closed set of typed values?
Enum Type Model
        ↓
What does copying an object actually copy?
Object Copy Semantics
        ↓
What happens when several references share mutable state?
Shared References and Mutability
        ↓
How can objects be made safer to share?
Immutability and Defensive Copying
        ↓
How do all of these ideas fit into one object model?
Class/Object Lifecycle Synthesis
```

The main terminology fits together like this:

```text
class
→ defines the type, state shape and behavior

object / instance
→ one runtime entity created from that type

constructor
→ a special declaration that participates in object creation and establishes initial state

initialization
→ the process of assigning initial values/state to a class or object

this / super
→ express current-instance and superclass construction/member context

static / instance
→ distinguish class-level state/behavior from per-object state/behavior

reference / aliasing / copying / immutability
→ explain how objects are reached, shared, duplicated or protected from mutation
```
