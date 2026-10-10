**Key derivation** transforms input material into key material with properties suitable for a defined purpose.

The input may come from a password or from a protocol secret. This chapter focuses on password-based derivation because that is the module's curriculum ownership.

Human passwords usually have low and uneven entropy. Using password bytes directly as an AES or HMAC key makes offline guessing too cheap.

A password-based derivation mechanism introduces a salt and deliberate computational work so that each password guess costs more and precomputed results cannot be reused across records as easily.
