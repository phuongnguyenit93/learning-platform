# Immutability and Defensive Copying

When observable state cannot change after construction, sharing becomes much easier to reason about. But `final` fields alone are not enough; the entire reachable object graph and exposed references matter.
