Translation keys should be stable semantic identifiers rather than copies of the current English wording.

Prefer:

```properties
order.created=Order {0} was created.
order.cancelled=Order {0} was cancelled.
```

over a key whose identity is tied to one sentence spelling:

```properties
Order_was_created=Order was created
```

If the English wording changes later, `order.created` still represents the same application meaning.

### Do not build translatable sentences from fragments

Avoid:

```text
"Order " + id + " was " + statusText
```

because the translator cannot rearrange the full sentence naturally.

Prefer a complete parameterized resource:

```properties
order.status=Order {0} is {1}.
```

If different statuses require materially different grammar across languages, separate semantic message keys can be better than forcing every language into one English-shaped template.
