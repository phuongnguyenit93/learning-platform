# this, super, and Construction Chains

Inside instance code, Java needs a way to refer to **the current object** and to **superclass construction/member context**. `this` and `super` express those roles.

The practical reason they matter is constructor and member navigation: one object may need to reuse another constructor in the same class, while subclass construction must also initialize the superclass part of that same object.
