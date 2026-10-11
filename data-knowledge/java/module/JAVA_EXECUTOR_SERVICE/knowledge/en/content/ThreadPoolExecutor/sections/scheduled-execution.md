`ScheduledExecutorService` Supports three different semantics to distinguish:

```text
schedule()
→ run once after a delay

scheduleAtFixedRate()
→ try to maintain the cadence according to the expected start milestone

scheduleWithFixedDelay()
→ wait for a delay after the previous run is complete before scheduling the next one
```

`scheduleAtFixedRate()` no contract allows for the same **A Periodic Task** overlaps itself. If one run lasts longer than the period, the next may be delayed; the scheduler does not clone itself to the same task to run in parallel just because of the missed cadence.

References:

```text
ThreadPoolController#scheduledExecution()
GET /thread-pool/scheduled-execution
```

The experiment runs only a few iterations and then cancels both the periodic task and the shutdown executor. The goal is to learn scheduling semantics without letting the background task live after the request.

Method runs each mode separately with `configuredIntervalMillis = 30`, the task simulation works at least about `60 ms`, and recorded the first three executions.
In `fixedRate.timeline` and `fixedDelay.timeline`, observe:

- `startMillis`, `EndMillis`: the actual time from the time of schedule preparation.
- `workMillis`: measured execution time.
- `gapAfterPreviousEndMillis`: the interval from the end of the previous time to the beginning of this time; the first time is `null`.

When a task is longer than the period, fixed-rate usually runs the next time almost immediately after the previous one is finished to process the delayed schedule. Fixed-delay still waits for the configured delay period after completion.
Scheduler/OS can cause additional latency, so don't assert an exact timing number or conclude that the fixed-rate is always faster on every run.
`noOverlapObserved` are calculated from the timelines. Since the demo uses a worker, this field only confirms non-overlapping observations; the non-overlap guarantee of the same periodic task comes from the Java API, not this benchmark.

### <a id="scheduled-failure">Exception in periodic task</a>

A very important production semantics of `ScheduledExecutorService`: if an execution of a periodic task throws an exception out, the next execution of the **Same Periodic Task** suppressed.

This is different from thinking:

```text
Run #1 Error
→ the scheduler logs itself and still runs #2, #3, #4...
```

Don't rely on that assumption.

References:

```text
ThreadPoolController#scheduledFailure()
GET /thread-pool/scheduled-failure
```

Experiment Creation `scheduleAtFixedRate()` which always throws for the first time:

```text
Run #1
→ IllegalStateException
→ ScheduledFuture complete exceptionally
→ runsObserved = 1
→ laterExecutionsSuppressed = true
```

`ScheduledFuture.get()` Allows the caller to observe the failure via `ExecutionException`, but Production Periodic Jobs usually don't have callers sitting `get()`. Therefore, periodic tasks need appropriate logging/metrics/alerting and exception boundaries; if the business wants the job to continue after a processed failure, the task must catch/handle the failure according to a clear policy.
