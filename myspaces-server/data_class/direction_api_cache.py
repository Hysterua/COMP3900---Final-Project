# Version: python:3.8
#
# Name: direction_api_cache.py
#
# Description: DirectionAPICache class file. Used to cache direction instructions and map polylines to limit the number Google Maps API calls. Contains functions to interact with database interface.
#
# Author: Jasper Na

from datetime import datetime
from .dataobject import DataObject


class DirectionAPICache(DataObject):

    RELATION_NAME = "DirectionsAPICache"
    ID_COL_NAME = "ListingID"
    DO_NOT_ALTER_COLUMNS = [ID_COL_NAME]

    def __init__(
        self,
        ListingID: int,
        Suburb: str,
        Duration: int,
        Distance: float,
        TransitMethod: str,
        TransitSummary: str,
        Polyline: str,
        DateCached: datetime,
    ):
        self.ListingID = ListingID
        self.Suburb = Suburb.upper()
        self.Duration = Duration
        self.Distance = Distance
        self.TransitMethod = TransitMethod
        self.TransitSummary = TransitSummary
        self.Polyline = Polyline
        self.DateCached = str(DateCached)

    @staticmethod
    # Insert new Directions API Cache into the Database
    def insert_new_cache(new_cache):
        return DataObject.insert(new_cache)

    @staticmethod
    # returns a Listing object from database tuple (if ID exists), else None
    def get_cache(listing_id: int, suburb: str):
        return DataObject.get_object(
            DirectionAPICache,
            f"{DirectionAPICache.ID_COL_NAME} = {listing_id} AND Suburb = '{suburb.upper()}'",
        )

    @staticmethod
    # returns a list of all Listing Objects made from database (Empty List returned otherwise)
    def get_all_cache():
        return DataObject.get_all_objects(DirectionAPICache)
