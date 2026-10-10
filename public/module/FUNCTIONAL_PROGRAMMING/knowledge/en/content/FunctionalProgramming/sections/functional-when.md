The paradigm is especially useful for data transformations, pipelines, business rules expressible as small functions, and logic that should be easy to test.

It does not eliminate side effects. I/O, databases, networks, and stateful interaction still exist; the goal is to **isolate and control them**.
