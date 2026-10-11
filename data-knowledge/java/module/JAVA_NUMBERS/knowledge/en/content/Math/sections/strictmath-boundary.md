`Math` is the normal choice for application code.

`StrictMath` exists for cases that require more strictly specified/reproducible behavior for relevant floating-point mathematical functions.

```text
Math
→ default numeric helper API

StrictMath
→ prioritizes specified reproducibility for relevant functions
```

Do not read `StrictMath` as "perfectly exact Math". It still operates on floating-point values and inherits the representation limits of `double/float`.

The boundary matters when cross-platform reproducibility is itself a requirement.

The next two chapters move from number representation to a different contract: **randomness**. A final synthesis chapter then reconnects every representation and policy into one decision model.
