# Version: python:3.8
#
# Name: frontend_interface.py
#
# Description: Frontend interface used to interact with the database
#
# Author: E. Omer Gul, Jasper Na

from datetime import datetime
from data_class.frontend_objects import *
from data_class.user import User
from data_class.listing import Listing
from data_class.booking import Booking
from data_class.review import Review
from data_class.direction_api_cache import DirectionAPICache
from search.distance_mapper import DistanceMapper
from search.search_algorithm import SearchAlgorithm
from utility.error_codes import ErrorCodes
from utility.email_interface import EmailInterface
from data_class.dataobject import DataObject
from car_cleaning_addon.car_cleaning_addon import Schmiko


class FrontEnd_Interface:

    DEFAULT_ID: int = -1

    @staticmethod
    # Formats Data Objects into an array of corresponding attributes __dict__'s for FastAPI response object
    def format_object_list(list_of_objects):
        data = []
        if len(list_of_objects) > 0:
            for x in list_of_objects:
                data.append(x.__dict__)
        return data

    @staticmethod
    # Formats given error code and payload into expected FastAPI response object
    def format_return(
        error_code: int,
        include_payload: bool = False,
        payload: object = None,
        format_as_list: bool = False,
        access_internal_dict: bool = True,
    ):
        if include_payload == False:
            return {"ErrorCode": error_code}
        if payload == None:
            return {"ErrorCode": error_code, "Payload": None}
        if format_as_list:
            data = []
            if type(payload) == list:
                for x in payload:
                    data.append(x.__dict__ if access_internal_dict else x)
            else:
                data.append(payload.__dict__ if access_internal_dict else payload)
        else:
            data = payload.__dict__ if access_internal_dict else payload
        return {"ErrorCode": error_code, "Payload": data}

    # --------------------------------------
    # Insert records into the database
    # --------------------------------------

    @staticmethod
    def insert_new_user(front_end_user_obj: PostUserRequest):
        new_user = User(
            FrontEnd_Interface.DEFAULT_ID,
            *(front_end_user_obj.__dict__.values()),
            rawPassword=True,
        )
        return FrontEnd_Interface.insert_new_object(None, new_user)

    @staticmethod
    # A new listing is first verified that the given address is valid before inserting into the database
    # otherwise CODE_UNABLE_TO_GEOTAG is returned
    def insert_new_listing(front_end_listing_obj: PostListingRequest):
        # Map listing address to corresponding geocode coordinates
        # if not lond/latitudes resolve, then listing is not valid and will not be inserted into the database
        lat_long_pair = DistanceMapper.address_to_geocode(
            front_end_listing_obj.StreetNumber,
            front_end_listing_obj.Street,
            front_end_listing_obj.Suburb,
            front_end_listing_obj.PostCode,
            try_suburb=False,
        )
        if lat_long_pair is None:
            print(
                "ERR: Address could not be mapped into corresponding geodata coordinates"
            )
            return FrontEnd_Interface.format_return(ErrorCodes.CODE_UNABLE_TO_GEOTAG)
        insert_vals = list(
            front_end_listing_obj.__dict__.values()
        )  # Visible attribute is after the longitude/latitude pair
        new_listing = Listing(
            FrontEnd_Interface.DEFAULT_ID,
            *(insert_vals[:-1]),
            *lat_long_pair,
            insert_vals[-1],
        )
        return FrontEnd_Interface.insert_new_object(None, new_listing)

    @staticmethod
    def insert_new_booking(front_end_booking_obj: PostBookingRequest):
        return FrontEnd_Interface.insert_new_object(front_end_booking_obj, Booking)

    @staticmethod
    def insert_new_review(front_end_review_obj: PostReviewRequest):
        booking: Booking = Booking.get_booking(front_end_review_obj.BookingID)
        if booking is None:
            return FrontEnd_Interface.format_return(ErrorCodes.CODE_UNKNOWN_BOOKING)
        # only accept reviews for bookings in the past
        if booking.get_end_date() > datetime.now():
            return FrontEnd_Interface.format_return(ErrorCodes.CODE_PAST_BOOKINGS_ONLY)
        user: User = User.get_user(booking.BookedBy)
        if user is None:
            return FrontEnd_Interface.format_return(ErrorCodes.CODE_UNKNOWN_REVIEWER)
        new_review = Review(
            FrontEnd_Interface.DEFAULT_ID,
            front_end_review_obj.BookingID,
            booking.BookedSpace,
            user.Username,
            front_end_review_obj.Liked,
            front_end_review_obj.Comment,
        )
        return FrontEnd_Interface.insert_new_object(None, new_review)

    @staticmethod
    # Generic function
    # It is assumed that the attr dict of given form argument will expand into arguments needed for
    #   corresponding data_obj's constructor.
    # An empty form (None) indicates caller has already constructed DataObject. As such
    #   no new DataObject will be created and data_obj can be immediately be inserted
    # If a new user has been inserted then a welcome email is sent
    # If a new booking has been inserted than a confirmation email is sent
    def insert_new_object(form, data_obj: DataObject):
        new_object = (
            data_obj
            if form is None
            else data_obj(FrontEnd_Interface.DEFAULT_ID, *(form.__dict__.values()))
        )
        errorCode, payload = type(new_object).insert(
            new_object, new_object.ID_COL_NAME, new_object.ID_COL_NAME
        )

        if errorCode != ErrorCodes.CODE_SUCCESS:
            print("ERR: UserID not returned from database")
        else:
            new_object.set_id(payload)
            print(new_object)
            if type(new_object) == User:
                print("New user! Sending welcome email.")
                EmailInterface.send_welcome_email(new_object)
            elif type(new_object) == Booking:
                print("New Booking! Sending booking email.")
                EmailInterface.send_confirmation_email(new_object)

        return FrontEnd_Interface.format_return(errorCode)

    # --------------------------------------
    # Retrieve all records from the database
    # --------------------------------------

    @staticmethod
    def get_all_users():
        return FrontEnd_Interface.get_all_objects(User)

    @staticmethod
    def get_all_listings():
        return FrontEnd_Interface.get_all_objects(Listing)

    @staticmethod
    def get_all_bookings():
        return FrontEnd_Interface.get_all_objects(Booking)

    @staticmethod
    def get_all_reviews():
        return FrontEnd_Interface.get_all_objects(Review)

    @staticmethod
    # Function calls the given Data Objects get_all_objects function to return all database records for a given object type
    def get_all_objects(data_obj: DataObject):
        result = data_obj.get_all_objects(data_obj)
        if result is None:
            return FrontEnd_Interface.format_return(ErrorCodes.CODE_FAILURE, True)
        elif len(result) < 1:
            # An empty list is a valid return from a database query
            return FrontEnd_Interface.format_return(ErrorCodes.CODE_NO_RESULTS, True)
        else:
            return FrontEnd_Interface.format_return(
                ErrorCodes.CODE_SUCCESS, True, result, format_as_list=True
            )

    # --------------------------------------
    # Retrieve single record from the Database based on ID
    # --------------------------------------

    @staticmethod
    def get_user(user_id: int):
        return FrontEnd_Interface.wrap_get_object(User.get_user(user_id))

    @staticmethod
    def get_listing(listing_id: int):
        return FrontEnd_Interface.wrap_get_object(Listing.get_listing(listing_id))

    @staticmethod
    def get_listing_transit_info(listing_id: int, suburb: str):
        return FrontEnd_Interface.wrap_get_object(
            DirectionAPICache.get_cache(listing_id, suburb)
        )

    @staticmethod
    def get_booking(booking_id: int):
        return FrontEnd_Interface.wrap_get_object(Booking.get_booking(booking_id))

    @staticmethod
    def get_review(review_id: int):
        return FrontEnd_Interface.wrap_get_object(Review.get_review(review_id))

    @staticmethod
    # Wrapper formats return object with CODE_NO_MATCHING_ID if database lookup did not return anything
    def wrap_get_object(data_obj: DataObject, expects_list: bool = False):
        if data_obj is None:
            return FrontEnd_Interface.format_return(
                ErrorCodes.CODE_NO_MATCHING_ID, True
            )
        else:
            return FrontEnd_Interface.format_return(
                ErrorCodes.CODE_SUCCESS, True, data_obj, expects_list
            )

    # --------------------------------------
    # Retrieve targeted record from the Database
    # --------------------------------------

    @staticmethod
    # Gets all park listings listed by given user
    def get_users_listings(user_id: int):
        return FrontEnd_Interface.wrap_get_object(
            DataObject.get_object(
                Listing,
                f"{Listing.USER_REFERENCE_COL_NAME} = {user_id} AND Deleted = 0",
            ),
            True,
        )

    @staticmethod
    # gets all bookings associated with a given park listing
    def get_listings_bookings(listing_id: int):
        return FrontEnd_Interface.wrap_get_object(
            DataObject.get_object(
                Booking, f"{Booking.LISTING_REFERENCE_COL_NAME} = {listing_id}"
            ),
            True,
        )

    @staticmethod
    # gets all bookings made by a given user seperated in previous (Completed) and future bookins.
    # Seperation is made based on the time of the route call
    def get_users_bookings(user_id: int):
        user_bookings = DataObject.get_object(
            Booking, f"{Booking.USER_REFERENCE_COL_NAME} = {user_id}"
        )
        previous = []
        future = []
        if user_bookings is not None:
            if type(user_bookings) != list:
                user_bookings = [user_bookings]
            date_now = datetime.now()
            previous = list(
                filter(lambda b: b.get_end_date() < date_now, user_bookings)
            )
            future = list(set(user_bookings) - set(previous))
        return FrontEnd_Interface.format_return(
            ErrorCodes.CODE_SUCCESS,
            True,
            {
                "Previous": FrontEnd_Interface.format_object_list(previous),
                "Future": FrontEnd_Interface.format_object_list(future),
            },
            access_internal_dict=False,
        )

    @staticmethod
    # Gets all reviews for a given park listing
    # A reivew summary is returned that counts the all "likes" for a listing
    # along with a a list of usernames (To avoid real names) and corresponding comments
    def get_listings_reviews(listing_id: int):
        listings_reviews = DataObject.get_object(
            Review, f"{Review.LISTING_REFERENCE_COL_NAME} = {listing_id}"
        )
        num_likes = 0
        comments = []
        if listings_reviews is not None:
            if (
                type(listings_reviews) != list
            ):  # case for singular review returns as object rather than list(object)
                listings_reviews = [listings_reviews]
            num_likes = sum(1 for review in listings_reviews if review.Liked)
            reviews_w_comments = list(
                filter(lambda r: r.Comment != "", listings_reviews)
            )
            comments = list(
                map(
                    lambda r: {"Username": r.Username, "Comment": r.Comment},
                    reviews_w_comments,
                )
            )
        return FrontEnd_Interface.format_return(
            ErrorCodes.CODE_SUCCESS,
            True,
            {"TotalLikes": num_likes, "Comments": comments},
            access_internal_dict=False,
        )

    @staticmethod
    # Gets a review left after a booking
    def get_bookings_reviews(booking_id: int):
        bookings_reviews = DataObject.get_object(
            Review, f"{Review.BOOKING_REFERENCE_COL_NAME} = {booking_id}"
        )
        if type(bookings_reviews) == list:
            bookings_reviews = bookings_reviews[0]
        return FrontEnd_Interface.wrap_get_object(bookings_reviews, False)

    # --------------------------------------
    # Update Records within the Database
    # --------------------------------------

    @staticmethod
    def edit_user(form: PutUserRequest):
        return FrontEnd_Interface.edit_object(User.get_user(form.UserID), form.__dict__)

    @staticmethod
    def edit_listing(form: PutListingRequest):
        return FrontEnd_Interface.edit_object(
            Listing.get_listing(form.ListingID), form.__dict__
        )

    @staticmethod
    def edit_review(form: PutReviewRequest):
        return FrontEnd_Interface.edit_object(
            Review.get_review(form.ReviewID), form.__dict__
        )

    @staticmethod
    # Generic edit object function compares the updated and existing database record,
    # and will make changes if any attributes have changed
    def edit_object(old_data_obj: DataObject, form_as_dict: dict):
        if old_data_obj is None:
            return FrontEnd_Interface.format_return(ErrorCodes.CODE_NO_MATCHING_ID)
        error_code, _ = old_data_obj.update_partial_object(form_as_dict)
        return FrontEnd_Interface.format_return(error_code)

    # --------------------------------------
    # Delete/Hide Records within the Database
    # --------------------------------------

    @staticmethod
    # Unlike other delete functions which removes record from database
    #   Deleting Listing marks record with deleted flag
    def delete_listing(listing_id: int):
        target: Listing = Listing.get_listing(listing_id)
        if target is None:
            return FrontEnd_Interface.format_return(ErrorCodes.CODE_NO_MATCHING_ID)

        temp = {"Deleted": target.ListingID}
        return FrontEnd_Interface.edit_object(target, temp)

    @staticmethod
    def delete_booking(booking_id: int):  # # TODO decide disable or delete?
        return FrontEnd_Interface.delete_object(Booking.get_booking(booking_id))

    @staticmethod
    def delete_review(review_id: int):
        return FrontEnd_Interface.delete_object(Review.get_review(review_id))

    @staticmethod
    # Wrapper function returns CODE_NO_MATCHING_ID if ID did not exist in the database
    # for a given Data Object, otherwise it is deleted from the database.
    def delete_object(data_obj: DataObject):
        if data_obj is None:
            return FrontEnd_Interface.format_return(ErrorCodes.CODE_NO_MATCHING_ID)
        else:
            error_code, _ = data_obj.delete_object()
            return FrontEnd_Interface.format_return(error_code)

    # --------------------------------------
    # USER AUTHENTICATION
    # --------------------------------------

    @staticmethod
    # Authentication function takes a user email and raw password
    # This raw password is hashed and then a combination of email and hashed password are queried in the database
    # If no results are returned then email or password was incorrect
    def authenticate_user(front_end_login_obj: PostLoginRequest):
        access = User.authenticate_user(
            front_end_login_obj.Email, front_end_login_obj.Password
        )
        if access == False:
            print(
                f"Login Failure ({front_end_login_obj.Email}): Incorrect Email or password."
            )
            return FrontEnd_Interface.format_return(
                ErrorCodes.CODE_INCORRECT_EMAIL_PASS, True
            )
        else:
            print(f"Login Success for {front_end_login_obj.Email}")
            return FrontEnd_Interface.format_return(
                ErrorCodes.CODE_SUCCESS,
                True,
                User.get_user_by_email(front_end_login_obj.Email),
            )

    # --------------------------------------
    # SEARCHING
    # --------------------------------------

    @staticmethod
    # Main search algorithm on MySpaces that returned all avaliable listings within a 3km radius of
    # desired suburb. Availability is based on the desired booking_start and booking_end times.
    # Suitability is determined based on passed filters
    # The three closest listings to the search suburb are returned in Recommended, and the rest returned in Remaining
    def search_query(
        search_term: str,
        booking_start: str = None,
        booking_end: str = None,
        cost: str = None,
        length: str = None,
        width: str = None,
        height: str = None,
    ):
        # Uses the search algorithm to first find the closeness of various spots to this suburb
        cost = "0" if cost is None else cost
        length = "0.0" if length is None else length
        width = "0.0" if width is None else width
        height = "0.0" if height is None else height
        results = SearchAlgorithm.search_listings(
            search_term,
            booking_start,
            booking_end,
            int(cost),
            float(length),
            float(width),
            float(height),
        )

        # 0 Search results is not an error, however an empty list will return
        # if Results is None then the suburb was unable to be converted to any geotag codes
        if results is None:
            return FrontEnd_Interface.format_return(
                ErrorCodes.CODE_UNABLE_TO_GEOTAG_SEARCH, True
            )
        [recommended, remaining] = results
        return FrontEnd_Interface.format_return(
            ErrorCodes.CODE_SUCCESS,
            True,
            {
                "Recommended": FrontEnd_Interface.format_object_list(recommended),
                "Remaining": FrontEnd_Interface.format_object_list(remaining),
            },
            access_internal_dict=False,
        )

    @staticmethod
    # PT Search search for all listings within a 4-10KM radius and resolves an estimated public transport journey
    # The three listings that correspond to the fasted PT journeys are returned
    def search_query_with_pt(
        suburb: str,
        booking_start: str,
        booking_end: str,
        cost: str,
        length: str,
        width: str,
        height: str,
    ):
        results = SearchAlgorithm.search_with_public_transit(
            suburb,
            booking_start,
            booking_end,
            int(cost),
            float(length),
            float(width),
            float(height),
        )
        # 0 Search results is not an error, however an empty list will return
        # if Results is None then the suburb was unable to be converted to any geotag codes
        if results is None:
            return FrontEnd_Interface.format_return(
                ErrorCodes.CODE_UNABLE_TO_GEOTAG_SEARCH, True
            )
        return FrontEnd_Interface.format_return(
            ErrorCodes.CODE_SUCCESS, True, results, format_as_list=True
        )

    # --------------------------------------
    # SCHMICKO
    # --------------------------------------

    @staticmethod
    # Function returns all avaliable car detailing packages
    def pull_schmicko_data():
        results = Schmiko.pull_schmicko_data()
        if results is None:
            return FrontEnd_Interface.format_return(ErrorCodes.CODE_FAILURE, True)
        return FrontEnd_Interface.format_return(
            ErrorCodes.CODE_SUCCESS,
            True,
            results,
            format_as_list=True,
            access_internal_dict=False,
        )

    @staticmethod
    # finds all availabilities for given car detailing packages
    def find_schmiko_availability(date):
        results = Schmiko.find_schmiko_availability(date)
        if results is None:
            return FrontEnd_Interface.format_return(ErrorCodes.CODE_FAILURE, True)
        return FrontEnd_Interface.format_return(
            ErrorCodes.CODE_SUCCESS,
            True,
            {"BookingTimes": results},
            format_as_list=True,
            access_internal_dict=False,
        )
