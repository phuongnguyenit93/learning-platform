Java evaluates argument expressions left to right before entering the method body.

Even with defined order, side-effect-heavy argument lists are hard to read. Extract meaningful intermediate calculations when order matters.

The receiver and argument expressions are evaluated before entering the method body. The callee receives their resulting **values**, not the caller's variable slots. That leads directly to Java's pass-by-value model.
