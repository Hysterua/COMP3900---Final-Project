# Version: python:3.8
#
# Name: listing.py
#
# Description: Listings class file. Contains functions to interact with database interface
#
# Author: E. Omer Gul, Jasper Na

from .dataobject import DataObject


class Listing(DataObject):

    RELATION_NAME = "Listings"
    ID_COL_NAME = "ListingID"
    DO_NOT_ALTER_COLUMNS = [ID_COL_NAME, "ListedBy"]
    USER_REFERENCE_COL_NAME = "ListedBy"

    def __init__(
        self,
        ListingID: int,
        ListedBy: int,
        HourlyPrice: int,
        Notes: str,
        StreetNumber: int,
        Street: str,
        Suburb: str,
        PostCode: int,
        Width: float,
        Height: float,
        Depth: float,
        Latitude: float,
        Longitude: float,
        Visible: bool,
        Deleted: int = 0,
    ):
        self.ListingID = ListingID
        self.ListedBy = ListedBy
        self.HourlyPrice = HourlyPrice
        self.Notes = Notes
        self.StreetNumber = StreetNumber
        self.Street = Street
        self.Suburb = Suburb
        self.PostCode = PostCode
        self.Width = Width
        self.Height = Height
        self.Depth = Depth
        self.Latitude = Latitude
        self.Longitude = Longitude
        self.Visible = Visible
        self.Deleted = Deleted

    def set_id(self, ID: int):
        self.ListingID = ID

    def get_id(self):
        return self.ListingID

    def address(self, street_only: bool = False, full_address: bool = False):
        if street_only:
            return f"{self.StreetNumber} {self.Street}"
        ret = f"{self.StreetNumber} {self.Street}, {self.Suburb}"
        return ret + f", {self.PostCode}" if full_address else ret

    def __str__(self):
        return f"Listing ID:{self.ListingID}, Listed By:{self.ListedBy} Address: {self.StreetNumber}, {self.Street}, {self.Suburb}, {self.PostCode}, Notes: {self.Notes}, Visible:{self.Visible}, Deleted: {self.Deleted}"

    @staticmethod
    # inserts a new listing object into the database
    def insert_listing(new_listing):
        return DataObject.insert(new_listing, Listing.ID_COL_NAME, Listing.ID_COL_NAME)

    @staticmethod
    # returns a Listing object from database tuple (if ID exists), else None
    def get_listing(listing_id: int):
        print(
            f"Attempting to retrieve listings for {Listing.ID_COL_NAME} = {listing_id}"
        )
        return DataObject.get_object(Listing, f"{Listing.ID_COL_NAME} = {listing_id}")

    @staticmethod
    # returns a list of all Listing Objects made from database (Empty List returned otherwise)
    # Returning listings marked hidden and deleted can be controlled by args
    def get_all_listings(include_hidden: bool, include_deleted: bool = False):
        where_str: str = ""
        if include_hidden == False:
            where_str = "Visible=True"
        if include_deleted == False:
            where_str += " AND Deleted=0" if where_str != "" else "Deleted=0"
        return DataObject.get_all_objects(Listing, where_str)
