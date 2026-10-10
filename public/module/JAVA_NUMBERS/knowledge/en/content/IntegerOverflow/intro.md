# Fixed-Width Integers and Overflow

Primitive integers feel exact, but they are exact only **inside a fixed range**. Crossing `MIN_VALUE` or `MAX_VALUE` does not automatically switch Java to `BigInteger` or throw an exception.
