An object can absolutely construct a dependency itself when that dependency is small, stable, and truly an implementation detail.

DI becomes useful when a dependency is a collaborator with its own contract, lifecycle, or environment/test-specific implementation.
