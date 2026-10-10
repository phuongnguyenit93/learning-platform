# throw, throws, and Exception Propagation

`throw` and `throws` are related to exceptions but belong to different moments:

```text
throw
→ a statement executed at runtime

throws
→ part of a method or constructor declaration
```

Mental model:

```text
throw  = "failure happens on this execution path now"
throws = "this method may let this failure escape to its caller"
```
