# Object Copy Semantics

“Copy an object” is ambiguous in Java. It can mean copying a reference, creating a shallow copy, or constructing a deep copy. The real design question is ownership: which mutable state may remain shared, and which state must become independent?
