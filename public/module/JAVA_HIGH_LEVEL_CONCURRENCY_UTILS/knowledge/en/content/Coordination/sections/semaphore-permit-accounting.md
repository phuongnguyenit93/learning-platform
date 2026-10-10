References:

```text
CoordinationController#semaphorePermitAccounting()
GET /coordination/semaphore-permit-accounting
```

The experiment starts with a permit and then deliberately calls `release()` but have not yet acquired:

```text
initialPermits = 1
permitsAfterUnmatchedRelease = 2
semaphoreEnforcesOwner = false
```

After the over-release, the code can even acquire two licenses at the same time even though the initial resource only has a capacity of 1.

**Final Thoughts** With Semaphore, permit accounting is the responsibility of the application. Pattern `Boolean acquired` + `finally` Helps avoid release when acquisition fails/interrupted.
