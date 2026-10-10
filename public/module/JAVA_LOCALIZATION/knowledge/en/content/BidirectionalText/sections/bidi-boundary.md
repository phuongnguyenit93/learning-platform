`Bidi` is **not a text renderer**.

It analyzes direction and run structure so a renderer or UI toolkit can perform ordering/layout correctly. Font selection, glyph shaping, measuring, pixel layout, and drawing belong to the rendering/UI stack.

Keep the boundary clear:

```text
String
→ stores logical text

java.text.Bidi
→ analyzes direction / runs

UI renderer / layout engine
→ produces actual visual output
```

Modern Java UI/framework stacks often handle bidi automatically, and backend code rarely needs to instantiate `Bidi` directly. Internationalization-aware developers still need the model to avoid anti-patterns such as:

```text
manually reversing Arabic/Hebrew strings
assuming all visible text is left-to-right
placing punctuation by string hacks based on visual position
treating a mixed-direction string as one uniform RTL block
```

One final rule:

```text
logical content
→ keep correct Unicode data

direction analysis
→ let Unicode bidi rules / standard APIs handle it

visual layout
→ let the renderer own it
```

After the human-text milestone, the final milestone returns to **module-wide safety policy**: `ResourceBundle` fallback, default Locale behavior, machine-stable data, and common localization pitfalls.
