# Repeatable and Inherited Semantics

Repeatability and inheritance affect annotation lookup in ways that are easy to misread from source syntax. A method may visibly contain two `@Audit` annotations while the class file represents them through a container; a subclass may appear to “have” an annotation even though it was declared only on a superclass.

The important skill is to distinguish **what was declared** from **what a particular lookup API returns**.
