A constructor may throw if it cannot establish valid state.

If construction fails, the `new` expression does not return a fully constructed reference to the caller. However, side effects performed before failure can still have happened.

Avoid publishing `this` from a constructor too early; the Object Creation Process chapter returns to that risk.

Next we examine the `this` reference for the current object and the `super` keyword/forms used to select superclass construction/member context.
