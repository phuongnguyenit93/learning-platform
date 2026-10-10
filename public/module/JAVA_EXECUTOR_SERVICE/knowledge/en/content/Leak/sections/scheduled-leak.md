Leaks/lifecycle bugs can also occur when the application accidentally creates multiple schedulers or registers the same periodic job multiple times.

Symptoms:

```text
A logical job
→ run 2, 3, 4 times per cycle
```

Must control the ownership of the scheduler and the registration lifecycle.
