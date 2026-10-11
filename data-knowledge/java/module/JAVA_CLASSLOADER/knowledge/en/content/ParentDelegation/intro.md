# Parent Delegation

Once several loaders exist, a new problem appears: when a child loader is asked for `demo.api.Plugin`, should it define its own copy or reuse the one its parent already knows? Java's default answer is **parent-first delegation**. That policy keeps shared types consistent while still allowing a child loader to define classes that its parent cannot find.
