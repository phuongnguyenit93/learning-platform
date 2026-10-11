removeTransformer has an explicit race: because class loading is multi-threaded, a transformer **can still receive callbacks after removal**.

Even with:

~~~java
enabled.set(false);
inst.removeTransformer(transformer);
~~~

the transformer should check:

~~~java
if (!enabled.get()) {
    return null;
}
~~~

If cleanup immediately releases a resource that a late callback still uses, the agent can race with itself.

Safe shutdown may require:

- atomic enabled state;
- an in-flight callback counter;
- deliberate resource lifetime;
- bounded callback work;
- idempotent cleanup.

Instrumentation code executes in a concurrent runtime path, not a simple sequential lifecycle.
