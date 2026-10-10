Individual constants may provide distinct implementations of abstract/overridable enum methods.

In the `FeeTier` example, calling `feeFor(...)` dispatches to the behavior of the selected constant. That gives polymorphic behavior inside a closed set of known instances.
