`ThreadLocalRandom` is designed for concurrent code to reduce contention when many threads need pseudo-random values.

```java
int value =
        ThreadLocalRandom.current()
                .nextInt(10, 20);
```

It is suitable for simulations, randomized scheduling, sampling, and non-security load-balancing heuristics.

The right questions are:

```text
does the use case have concurrent contention?
and
does the randomness require security unpredictability?
```

The repository uses a Java 21 baseline, where the modern `java.util.random.RandomGenerator` API and multiple generator implementations are available. The important boundary is that **algorithm choice, reproducibility, and concurrency model are separate concerns**; choosing among individual algorithms belongs at a deeper level.

`Math.random()` is also an ordinary pseudo-random convenience API; it does not make the result cryptographically secure.
