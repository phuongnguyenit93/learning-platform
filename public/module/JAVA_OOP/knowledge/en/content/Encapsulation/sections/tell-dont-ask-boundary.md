### WHAT — what does “Tell, don't ask” mean?

It is a heuristic: instead of pulling all data out of an object and making every decision in the caller, ask the object to perform behavior that belongs to its responsibility.

Rule leakage:

```java
if (account.getBalance() >= amount) {
    account.setBalance(account.getBalance() - amount);
}
```

More behavior-oriented:

```java
account.withdraw(amount);
```

In the second version, the caller expresses intent; the object keeps the rule.

### WHY — avoid duplicated domain rules

If several callers check balance independently, the rule is duplicated. If the rule later gains reserved funds or transaction fees, every caller may need to change.

### TRADE-OFF — do not turn the heuristic into dogma

Reporting, serialization, and read models legitimately expose data. DTOs do not need to pretend to be rich domain objects. “Tell, don't ask” is most useful when **domain behavior has leaked out of the object that owns the state**.

### RELATION — from encapsulation to inheritance

Once an object has a clear boundary and contract, the next question appears: **if several types share a contract, or one type is a specialized form of another, how does Java represent that relationship?** That is where inheritance and subtyping begin.
