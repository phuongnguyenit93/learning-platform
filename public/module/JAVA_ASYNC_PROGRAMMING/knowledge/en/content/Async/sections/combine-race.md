`allOf(...)` completion when all future inputs are complete.

`allOf(...)` Pay `CompletableFuture<Void>`; If the result typed of each future is needed, the application must still keep the reference and get the result of each stage after the barrier completion is complete.

"Completed" here does not mean "successful". If an input future completes exceptionally, the aggregate future of `allOf(...)` also complete exceptionally after the required inputs have been completed under the contract.

The point that is easy to mistake is `allOf()` **Not a fail-fast barrier** in the sense that "a child fail is an aggregate that is immediately completed". For example:

```text
A fail first
B is not yet complete

allOf(A, B)
→ aggregate is not yet complete

B complete later
→ now aggregate complete exceptionally
```

If the business needs to fail-fast orchestration and actively cancel the remaining work, the application must develop its own policy instead of inferring from `allOf()`.

`anyOf(...)` Completed when **A Future First** completed.

First completion can be success **or failure**. If the first future is complete exceptionally then aggregate `anyOf(...)` can also be completed exceptionally immediately; it doesn't ignore failure to wait for another future success.

That means:

```text
anyOf = fastest completion
```

Not:

```text
anyOf = best business result
```

Example of two servers bidding:

```text
Server A pre-completed: $200
Server B completed later: $190
```

`anyOf` can pay $200 because A is faster; it doesn't know that $190 is the "better price."

Failure race is similar:

```text
Server A fails first
Server B success after

anyOf(A, B)
→ first completion is failure
→ aggregate can be complete exceptionally
```

Also `allOf()` / `anyOf()` is **Completion Aggregation**, not a cancellation policy. It should not be assumed that if the aggregate completes/fails, the rest of the sibling futures will be canceled on their own. If the business needs winner-cancels-losers or fail-fast with cancellation, the application must design its own cancellation/cleanup.

References:

```text
AsyncController#fastest()
GET /async/fastest

AsyncController#allOf()
GET /async/all-of
```

Experiment controls the order of completions using coordination signals instead of relying on `sleep()` timing. Server A is allowed to complete before, after `anyOf` select the winner, then Server B will be released and cleaned up before the experiment ends.

The Experiment also creates a small race that doesn't require timing: one future is completed exceptionally first, the other succeeds later. Response confirming exceptional completion can be won `anyOf` and Losing Futures are not automatically canceled.

`allOf()` also run a case with a controlled completion order: input A fails before sibling B completes. The response confirms that the aggregate is incomplete immediately after the first failure, only completes after the other sibling is complete, and then exposes exceptional completion without canceling the sibling itself:

```text
aggregateCompletedImmediatelyAfterFirstFailure = false
aggregateWaitedForRemainingSibling = true
aggregateExceptionalWhenInputFails = true
successfulSiblingCancelledAutomatically = false
```

**Final Thoughts** Primitive Coordination does not replace the Business Selection Rule.
