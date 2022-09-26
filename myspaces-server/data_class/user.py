# Version: python:3.8
#
# Name: user.py
#
# Description: User class file. Contains files to interact with the database.
#
# Author: E. Omer Gul, Jasper Na


from .dataobject import DataObject
from utility.encryption import Encryption
from .listing import Listing


class User(DataObject):

    RELATION_NAME = "Users"
    ID_COL_NAME = "UserID"
    DO_NOT_ALTER_COLUMNS = [ID_COL_NAME]

    def __init__(
        self,
        UserID: int,
        Username: str,
        Password: str,
        Email: str,
        FirstName: str,
        LastName: str,
        PhoneNo: str,
        IsAdmin: bool,
        BSB: str = "",
        AccountNum: str = "",
        rawPassword: bool = False,
    ):
        self.UserID = UserID
        self.Username = Username
        self.UserPassword = User.encrpyt_password(Password) if rawPassword else Password
        self.Email = Email
        self.FirstName = FirstName
        self.LastName = LastName
        self.PhoneNo = PhoneNo
        self.IsAdmin = IsAdmin
        self.BSB = BSB
        self.AccountNum = AccountNum

    def __str__(self):
        return f"{self.UserID}, {self.Username}, E:{self.Email}, P:{self.PhoneNo}, {self.FirstName} {self.LastName}"

    def set_id(self, ID: int):
        self.UserID = ID

    def get_id(self):
        return self.UserID

    @staticmethod
    # Insert new user object into the Database
    def insert_user(new_user):
        return DataObject.insert(new_user, User.ID_COL_NAME, User.ID_COL_NAME)

    @staticmethod
    # Get a specfic user from the database
    # If User ID is not valid then None will be returned
    def get_user(user_id: int):
        return DataObject.get_object(User, f"{User.ID_COL_NAME} = {user_id}")

    @staticmethod
    # Get a specfic user from the database
    # If User email is not valid then None will be returned
    def get_user_by_email(email: str):
        return DataObject.get_object(User, f"Email = '{email}'")

    @staticmethod
    # Return all listings posted by a particular user ID
    def get_users_listings(user_id: int):
        return DataObject.get_object(Listing, f"ListedBy = {user_id}")

    @staticmethod
    # Returns True if the email and password combination is correct, false otherwise
    def authenticate_user(email: str, password: str):
        hash_pass = User.encrpyt_password(password)
        return (
            False
            if DataObject.get_object(
                User, f"Email = '{email}' AND UserPassword = '{hash_pass}'"
            )
            is None
            else True
        )

    @staticmethod
    # Hash encryption is applied to a give raw text password
    def encrpyt_password(raw_password: str):
        return Encryption.encrypt_string(raw_password)

    @staticmethod
    # Returns all User objects from the database
    def get_all_users():
        return DataObject.get_all_objects(User)
