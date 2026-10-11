# Collator and Locale-Aware Comparison

Sorting text looks simple until the order is meant for a human reader. `String.compareTo` compares strings lexicographically over their UTF-16 `char` code units; that deterministic order is not the same thing as the alphabetic order expected by every language.

`Collator` exists for **locale-sensitive text comparison and ordering**.
