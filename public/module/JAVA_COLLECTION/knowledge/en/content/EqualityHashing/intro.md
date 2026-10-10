# Equality, Hashing, and Lookup Correctness

Collections rely on element contracts to answer practical questions such as “is this element already present?”, “where is this key?”, and “are these two values the same logical element?”. A mistake in equality, hashing, or comparison can therefore make a collection appear to “lose” data even though the object still exists inside the structure.

This chapter focuses on the **collection consequences of equality, hashing, and comparison**. Designing `equals` and `hashCode` correctly is owned by the `object-contract` module.
