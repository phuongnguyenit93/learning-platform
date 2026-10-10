Before choosing an abstract class or interface, ask:

1. Does the caller need a **contract** or does it truly need one **concrete implementation**?
2. Do the related subtypes genuinely share state, invariants, or initialization rules?
3. Is this a natural class-family relationship or a role/capability that crosses class families?
4. Does one class need several independent roles?
5. If an interface uses `default`, is that default behavior actually valid for every legitimate implementation?
6. When several interfaces are combined, can method signatures or default behavior conflict?
7. If `InterfaceName.super` is needed, is the named interface an appropriate direct superinterface under Java syntax rules?

This helps avoid two common design mistakes: choosing an abstract class merely to reuse a few lines of code, or creating an interface simply to add another layer of indirection without a clear contract.
