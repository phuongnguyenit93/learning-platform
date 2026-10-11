# Locale and i18n Pitfalls

After learning each localization API individually, the most important practical skill is recognizing **where locale-sensitive behavior should not happen implicitly**. Many localization bugs are boundary mistakes: code fails to distinguish human-facing text from machine-facing data.
