A bidi paragraph can be analyzed into **directional runs**: consecutive ranges that share an embedding level/direction in the analysis result.

Mental model:

```text
paragraph
  ├─ run A → RTL
  ├─ run B → LTR (for example, a number or code)
  └─ run C → RTL
```

Beginner concepts to know:

```text
base direction
→ paragraph's overall base direction

LTR run
→ range handled left-to-right

RTL run
→ range handled right-to-left

embedding level
→ level used by the bidi algorithm to order directional runs
```

Developers do not need to implement the Unicode Bidirectional Algorithm. The key insight is that **mixed-direction text has structure**; it is not adequately modeled by one boolean such as `isRtl` for the whole string.
