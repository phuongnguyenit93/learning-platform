# The equals/hashCode Contract

`equals` and `hashCode` should not be designed independently. For hash-based collections they form **one combined contract**: hashing narrows the candidates, while equality confirms the logical match.

The previous chapters studied each method separately. This chapter focuses on **how they cooperate during lookup** and on observable runtime failures when the contract is broken.
