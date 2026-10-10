# ResourceBundle

Once an application knows the user's `Locale`, it still needs a scalable way to answer: **which message or resource should be used for that locale?** Hard-coded language branches do not scale. `ResourceBundle` separates localizable resources from Java source and resolves them by locale.
