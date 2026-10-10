Overloads that do not transmit the executor of the async factory/async continuation usually use the default async facility of `CompletableFuture`, commonly related `ForkJoinPool.commonPool()`.

Don't let a large workload block accidentally occupy the common pool without understanding the impact on other features in the process.

Custom executors are useful when needed:

- resource isolation;
- queue/capacity;
- thread naming;
- observability;
- shutdown policy;
- context propagation.
