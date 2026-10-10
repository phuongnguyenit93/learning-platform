Shared mutable state complicates reasoning because several locations may change the same object.

Typical consequences include:

- invariants broken outside the owner;
- order-dependent tests;
- concurrency races;
- caches/views changing indirectly;
- unclear mutation responsibility.

Mutability is not inherently wrong; unclear ownership is the bigger problem.
