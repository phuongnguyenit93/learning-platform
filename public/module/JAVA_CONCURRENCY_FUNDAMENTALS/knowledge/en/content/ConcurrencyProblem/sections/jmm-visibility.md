Visibility answers the question:

> If Thread A has written a value, what is the guarantee that Thread B will definitely see that value?

The Java Memory Model should not be interpreted with a simple mental model such as:

```text
Thread A writes RAM
Thread B reads RAM
```

Java does not require programmers to infer directly from the L1/L2/L3 cache or the CPU's register.

What programmers need to rely on is **Java Memory Model (JMM)**.

The JMM defines what the JVM must ensure about:

- visibility;
- ordering;
- synchronization actions;
- happens-before relationship.

If there is no consistent synchronization guarantee between the two actions, the fact that one thread is "written" in real time does not automatically guarantee that the other thread will observe the new value in the way the program intends.

### Stale data

Stale data is where one thread continues to observe the old state while another thread has updated the state.

Important Points:

```text
No stale data seen in one run
≠
thread-safe code
```

A visibility bug can depend on JVM optimization, architecture, timing, and how the program is compiled/run.

Therefore, it is not recommended to design lessons based on the objectives:

> "Run until the stale data appears to prove JMM."

The thing to learn is **Guarantee**, not hunting a random phenomenon.
