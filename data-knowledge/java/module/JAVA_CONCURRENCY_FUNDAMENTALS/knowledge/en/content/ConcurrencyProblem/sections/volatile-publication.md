`Volatile` Often used when a variable plays the role of publication/signal.

For example:

```java
int data = 0;
Boolean Ready = False;

Writer
data = 42;
ready = true;

reader
if (ready) {
    System.out.println(data);
}
```

Mental models should be used:

```text
write data = 42
        ↓ program order
write volatile ready = true
        ↓ volatile happens-before
read volatile ready == true
        ↓ program order
read data
```

Thanks to transitivity, the reader sees `ready == true` according to volatile synchronization, the writer's previous writes are also published in accordance with JMM.

No need to paraphrase with sentences:

```text
volatile = always read RAM straight
```

This is not a contract that Java programmers need to rely on.

### Demo volatile publication

References:

```text
ConcurrencyProblemController#volatilePublication()
```

Endpoint:

```text
GET /concurrency/problem/volatile-publication
```

Expected results:

```text
publishedData = 42
readerObservedData = 42
ready = true
```

**Final Thoughts** The Volatile Flag can publish the writes that occurred before it to the reader who reads that flag later.

### Volatile does not do count++ atomic

A variable can be `Volatile` But Compound Operation still races:

```java
volatile int count;

count++;
```

Read/write visibility doesn't turn the entire read-modify-write sequence into an atomic action.

References:

```text
ConcurrencyProblemController#volatileIsNotAtomic()
```

Endpoint:

```text
GET /concurrency/problem/volatile-not-atomic
```

The experiment uses the same deterministic lost-update technique as the demo race, but the field is declared. `Volatile`.

The result remains:

```text
expectedSequentialResult = 2
actualResult = 1
```

**Final Thoughts** `Volatile` solves a class of memory visibility/ordering issues; it does not replace `AtomicInteger`, `synchronized` or lock for Compound Update.
