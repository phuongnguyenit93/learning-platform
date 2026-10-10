# Mutation Ownership and Collection Views

The **Mutation Ownership, Views, and Fail-Fast Behavior** milestone begins by asking who owns structural change. When a method returns a collection, the important question is not only “which elements are present?” but also “who owns structural changes?”. Java offers several distinct shapes: modifiable collections, views that reject mutation, snapshots detached from later source changes, and factories that create unmodifiable collections.

These concepts govern **collection mutation**. They do not automatically make the objects stored inside the collection immutable. The next chapter keeps the same milestone but focuses on what can happen when structural mutation occurs while an iterator is traversing the collection.
