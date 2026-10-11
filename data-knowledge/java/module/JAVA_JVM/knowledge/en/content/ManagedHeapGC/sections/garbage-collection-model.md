A garbage collector is the storage-management subsystem that reclaims heap space while preserving Java-level program semantics.

A conceptual collector must solve problems such as:

1. identify live/reachable data;
2. identify and reclaim garbage;
3. possibly move/compact objects;
4. update references when objects move;
5. coordinate safely with application threads.

The specification does not require one collector or one algorithm. A collector may perform more stop-the-world work, more concurrent work, use regions, compact aggressively, or use a different organization.

Learn the **problem and trade-offs** before memorizing collector product names.
