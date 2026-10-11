One model should usually not serve every boundary at once.

A database entity has persistence concerns, an API DTO has external-contract concerns, and a domain model has business-invariant concerns.

Reusing one class everywhere allows changes at one boundary to leak into others.

Object Mapping lets each model keep its own responsibility while still moving data between them.
