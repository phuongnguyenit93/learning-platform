# Core Collection Contracts — Queue and Deque

The final part of the **Core Collection Contracts** milestone adds a stronger concern than storing or looking up values: **processing order**—which element leaves next, and which ends the caller may operate on. `Queue` and `Deque` model that concern directly.

For a set of orders waiting to be processed, indexes may be irrelevant. What matters is whether the earliest order leaves first, whether urgent work can be placed at the front, or whether priority determines the next item.
