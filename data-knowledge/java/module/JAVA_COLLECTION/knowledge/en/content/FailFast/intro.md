# Mutation During Iteration and Fail-Fast Behavior

Continuing the **Mutation Ownership, Views, and Fail-Fast Behavior** milestone, an iterator keeps traversal state while the collection may still be mutable. If the collection structure changes outside that iterator while traversal is in progress, the iterator's position may no longer mean what it originally meant. Many standard Java collection implementations respond with **fail-fast** behavior so that a broken traversal is detected early instead of silently continuing.

Fail-fast is a bug-detection mechanism for collection traversal. It is not a thread-synchronization mechanism and must not be the basis of correctness.
