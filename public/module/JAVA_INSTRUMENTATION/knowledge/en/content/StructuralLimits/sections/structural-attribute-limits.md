Beyond fields, methods, and hierarchy, some class-file attributes carry structural meaning and cannot be arbitrarily changed for an already-loaded class. In modern JVM TI redefine/retransform rules, important examples include:

- NestHost / NestMembers;
- Record;
- PermittedSubclasses.

These are not merely decorative metadata. They participate in nestmate access, record identity/components, and sealed-class hierarchy.

Do not assume:

~~~text
"it is only an attribute"
→ "it is safe to rewrite"
~~~

A bytecode library may happily emit bytes with different attributes; the JVM still decides whether that definition is legal for redefine/retransform.
