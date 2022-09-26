# Version: python:3.8
#
# Name: encryption.py
#
# Description: Used to encrypt user's passwords before being inserted into the database.
#
# Author: Jasper Na

from hashlib import sha256


class Encryption:
    @staticmethod
    def encrypt_string(payload: str) -> str:
        # Standard SHA256 used with bits converted back to hexidecimal
        return sha256(payload.encode()).hexdigest()
