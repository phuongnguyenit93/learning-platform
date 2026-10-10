1. Which state is actually shared?
2. Is that state mutable?
3. What atomicity, visibility, or ordering guarantee does correctness need?
4. What boundary is an object/reference published to another thread? Yes `this` Is Escape too soon?
5. Can sharing be avoided with immutability/message passing?
6. If you use a lock, what is lock owner/scope/order?
7. If Thread has to wait, which primitive coordination is suitable?
8. Does Executor have bounded capacity?
9. What is an Overload/rejection strategy?
10. Does Task have cancellation/timeout?
11. Who owns the lifecycle and shutdown resource?
12. Does ThreadLocal/context have a cleanup?
13. Does the demo/benchmark really prove what you conclude?
