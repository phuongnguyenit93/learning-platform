When the resource lifecycle is longer than the ownership/intention of the system and is no longer properly managed.

For example:

- request to create a pool but forget to shutdown;
- Thread infinite loop without cancellation path;
- the scheduler is registered repeatedly unintentionally;
- ThreadLocal workers keep the stale context;
- The queue backlog increases infinitely.
