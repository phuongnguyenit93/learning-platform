Scheduler Decision **When a task is triggered**; executor/thread decision **Where does the task run**.

```text
Schedule / Timer
→ trigger time
→ submit/run task
→ execution thread
```

The scheduler should not be replaced with:

```java
while (true) {
    Thread.sleep(...);
    runJob();
}
```

Because lifecycle, drift, cancellation, and exception handling are more difficult to manage.

### fixedRate and overlap

It should not be generalized that if a periodic task is not finished, the scheduler will definitely create hundreds of threads that overlap the task itself.

With `ScheduledThreadPoolExecutor`, successive executions of **Same Periodic Task** do not run simultaneously with itself.

If an execution of a periodic task to an exception exits, subsequent executions of the same periodic task are suppressed according to the scheduled executor's contract. So periodic job production needs a clear error-observation/handling policy, not just a scheduling policy.

In Spring, the actual overlap also depends on the scheduler, the number of scheduled registrations, and how the task is dispatched to another executor. The specific configuration must be analyzed.
