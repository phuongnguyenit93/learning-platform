# What Is Object-Oriented Programming (OOP) and Why Use It?

OOP does not begin with `class`, `extends`, or `interface`. It begins with a design question: **where should state, rules, and responsibilities live so that change does not spread across the whole program?**

Imagine a small checkout flow. At first, one function can read the cart, calculate a price, choose a payment path, and update state. As rules grow, that function accumulates branches, several places mutate the same state, and unrelated code starts knowing internal details. OOP is one way to reorganize those responsibilities around objects with explicit boundaries.
