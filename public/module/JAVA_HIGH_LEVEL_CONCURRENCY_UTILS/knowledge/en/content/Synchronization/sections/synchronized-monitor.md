Each Java object can be used as a monitor for `synchronized`.

```java
synchronized (lock) {
    Critical Section
}
```

When one thread is holding the monitor, another thread that wants to enter the critical section using the same monitor must wait.

`synchronized` Offer two important things:

- mutual exclusion: at a time only thread keeping monitor is running critical section;
- memory-consistency guarantee when released/acquired with monitor.

### Method and block

```java
public synchronized void update() {
}
```

Use your monitor `this`.

`Static synchronized` Use your own monitor `Class` object:

```java
public static synchronized void updateGlobal() {
}
```

Therefore, it is necessary to distinguish:

```text
instance synchronized method
→ lock this

Static synchronized method
→ lock MyClass.class
```

Two different instances don't block each other just because they call the same instance `synchronized` method; they only compete if they actually use the same monitor.

While:

```java
private final Object lock = new Object();

public void update() {
    synchronized (lock) {
    }
}
```

Allows selecting a separate monitor and keeping the lock scope smaller.

### Demo

References:

```text
SynchronizationController#synchronizedCounter()
GET /synchronization/synchronized-counter
```

Many workers increment the same counter but the increment method is `synchronized`.

Expected results:

```text
expected = actual
```

**Final Thoughts** `synchronized` Critical sections can be turned into mutual exclusion zones and Happens-Before can be created through Monitor Acquire/Release.
