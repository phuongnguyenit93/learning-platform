VM options are startup/configuration controls exposed by a JVM implementation and launcher. Conceptually they include:

- standard Java launcher options;
- `-X...` non-standard but common controls;
- `-XX:...` advanced HotSpot-specific controls.

Not every option is permanent or stable across JDK releases.

A disciplined operational model is:

1. know which layer owns the option;
2. verify support on the exact JDK you run;
3. document the reason/SLO for each non-default flag;
4. measure before and after;
5. remove cargo-cult flags copied from older systems/JDKs.

Treat JVM configuration like operational code: version it and require evidence.
