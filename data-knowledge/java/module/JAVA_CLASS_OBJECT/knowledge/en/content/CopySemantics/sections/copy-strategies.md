Clear alternatives to `clone()` include:

- copy constructors;
- static factories;
- builders initialized from an existing object;
- explicit mapping;
- serialization-based copying only when that contract truly fits.

Good copy APIs make it explicit which state is shared and which state is duplicated.

The next chapter studies the consequence of several references sharing mutable state: aliasing.
