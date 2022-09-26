# Version: python:3.8
#
# Name: booking.py
#
# Description:  Bookings class file. Contains functions to interact with database interface
#
# Author: E. Omer Gul, Jasper Na

from datetime import datetime
from .dataobject import DataObject


class Booking(DataObject):

    RELATION_NAME = "Bookings"
    ID_COL_NAME = "BookingID"
    USER_REFERENCE_COL_NAME = "BookedBy"
    LISTING_REFERENCE_COL_NAME = "BookedSpace"
    DO_NOT_ALTER_COLUMNS = [ID_COL_NAME]

    def __init__(
        self,
        BookingID: int,
        BookedBy: int,
        BookedSpace: int,
        StartDate: datetime,
        EndDate: datetime,
        TotalCost: int,
        Plate: str,
        CardNo: str,
        CardExpiry: str,
        SecurityCode: str,
    ):
        self.BookingID = BookingID
        self.BookedBy = BookedBy
        self.BookedSpace = BookedSpace
        self.StartDate = str(StartDate)
        self.EndDate = str(EndDate)
        self.TotalCost = TotalCost
        self.Plate = Plate
        self.CardNo = CardNo
        self.CardExpiry = CardExpiry
        self.SecurityCode = SecurityCode

    def set_id(self, ID: int):
        self.BookingID = ID

    def get_id(self):
        return self.BookingID

    def __str__(self):
        return f"BookingID: {self.BookingID}, BookedBy: {self.BookedBy}, BookedSpace: {self.BookedSpace}, start: {self.StartDate}, end: {self.EndDate}"

    def get_end_date(self):
        return datetime.strptime(self.EndDate, "%Y-%m-%d %H:%M:%S")

    @staticmethod
    # inserts a new booking object into the database
    def insert_booking(new_booking):
        return DataObject.insert(new_booking, Booking.ID_COL_NAME, Booking.ID_COL_NAME)

    @staticmethod
    # returns a Booking object from database tuple (if ID exists), else None
    def get_booking(booking_id: int):
        return DataObject.get_object(Booking, f"{Booking.ID_COL_NAME} = {booking_id}")

    @staticmethod
    # returns a list of all Booking Objects for a given listing address
    def get_all_listing_bookings(listing_id: int):
        return DataObject.get_all_objects(
            Booking, f"{Booking.LISTING_REFERENCE_COL_NAME} = {listing_id}"
        )

    @staticmethod
    # returns a list of all Booking Objects made from database (Empty List returned otherwise)
    def get_all_bookings():
        return DataObject.get_all_objects(Booking)
