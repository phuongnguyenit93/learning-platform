# Basic Threads in Java

This section builds the foundational mental model before going into interruption, Java Memory Model, synchronization, coordination, or thread pool.

Objectives after completing the course:

- Differentiate between Process, Thread and Task.
- Understand `start()` Others `run()` at what point.
- Know the two direct ways to create a Platform Thread using `Thread` and `Runnable`.
- Understand `Callable` does not create the Thread itself; it only describes a task with results.
- Read the statuses in the `Thread.State`.
- Understand exactly how Daemon Thread affects when a JVM ends.
