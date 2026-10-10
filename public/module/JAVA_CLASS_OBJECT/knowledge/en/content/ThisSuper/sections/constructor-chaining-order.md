For every class other than `Object`, a constructor chain eventually reaches a superclass constructor; following the inheritance chain ultimately ends at `Object()`.

```text
this(...)
→ another constructor in the same class
→ eventually super(...)
```

Constructor invocation follows special first-step rules in Java construction.

For the example above, the chain is:

```text
new SavingsAccount(...)
→ SavingsAccount(...)
→ super(id, balance)
→ BankAccount(id, balance)
→ Object()
```

Understanding this chain prepares us for initialization order later. First, the next chapter asks who may access each member.
