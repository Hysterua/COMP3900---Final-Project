# Version: python:3.8
#
# Name: review.py
#
# Description: Reviews class file. Contains function to interact with the database.
#
# Author: E.Omer Gul, Jasper Na


from .dataobject import DataObject


class Review(DataObject):

    RELATION_NAME = "Reviews"
    ID_COL_NAME = "ReviewID"
    BOOKING_REFERENCE_COL_NAME = "BookingID"
    LISTING_REFERENCE_COL_NAME = "ReviewedListing"
    DO_NOT_ALTER_COLUMNS = [ID_COL_NAME, "BookingID", "ReviewedListing", "Username"]

    def __init__(
        self,
        ReviewID: int,
        BookingID: int,
        ReviewedListing: int,
        Username: str,
        Liked: bool = False,
        Comment: str = "",
    ):
        self.ReviewID = ReviewID
        self.BookingID = BookingID
        self.ReviewedListing = ReviewedListing
        self.Username = Username
        self.Liked = Liked
        self.Comment = Comment

    def __str__(self):
        return f"{self.ReviewID}, {self.Username} reviewed {self.ReviewedListing}: {self.Liked}, N:{self.Comment}"

    def set_id(self, ID: int):
        self.ReviewID = ID

    def get_id(self):
        return self.ReviewID

    @staticmethod
    # returns a single Review object from database specified by the review id
    def get_review(review_id: int):
        return DataObject.get_object(Review, f"ReviewID = {review_id}")

    @staticmethod
    # returns a list of all Review objects from database
    def get_all_reviews():
        return DataObject.get_all_objects(Review)
