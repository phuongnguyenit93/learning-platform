This module owns the Java functional mechanisms that Stream APIs *consume*: functional interfaces, lambdas, method references, target typing, capture, and behavior composition.

The dedicated Stream API module owns Stream mechanics, including topics such as:

- creating Streams and understanding Stream sources;
- intermediate and terminal operation semantics;
- lazy evaluation and execution timing;
- reduction and collectors;
- encounter order and ordering behavior;
- parallel Stream behavior and its constraints.

Those subjects are intentionally not expanded here. Knowing the boundary prevents two common confusions: a lambda is not a Stream, and learning lambda syntax does not teach Stream execution semantics.
