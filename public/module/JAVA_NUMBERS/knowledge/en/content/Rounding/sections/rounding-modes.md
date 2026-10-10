### WHAT — what decision does each mode make?

When digits are discarded, Java needs a direction for the result.

| Mode | Mental model |
| --- | --- |
| `UP` | away from zero |
| `DOWN` | toward zero |
| `CEILING` | toward +∞ |
| `FLOOR` | toward -∞ |
| `HALF_UP` | nearest; tie → away from zero |
| `HALF_DOWN` | nearest; tie → toward zero |
| `HALF_EVEN` | nearest; tie → choose the neighbor with an even last digit |
| `UNNECESSARY` | rounding is forbidden; fail if it would be required |

Here a **tie** means the exact value is exactly halfway between the two rounding candidates, such as `2.5` when rounding to an integer. Outside a tie, all `HALF_*` modes choose the nearer candidate.

### WHY are UP/DOWN different from CEILING/FLOOR?

They can look similar for positive values but diverge for negative values:

```text
value = -2.1

UP      → -3   (away from zero)
DOWN    → -2   (toward zero)
CEILING → -2   (toward +∞)
FLOOR   → -3   (toward -∞)
```

Choose a mode from its mathematical direction and the domain policy, not from the name alone.

### Tie cases

```text
 2.5

HALF_UP   → 3
HALF_DOWN → 2
HALF_EVEN → 2

 3.5

HALF_UP   → 4
HALF_DOWN → 3
HALF_EVEN → 4
```

`HALF_EVEN` can reduce aggregate bias in some workloads with repeated ties, but it is not automatically correct for every domain.

The same tie rules apply to negative values according to each mode's direction. For example, `-2.5` becomes `-3` with `HALF_UP`, while `HALF_DOWN` and `HALF_EVEN` produce `-2`.
