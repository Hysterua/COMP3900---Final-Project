# Version: python:3.8
#
# Name: error_codes.py
#
# Description: ErrorCodes class deals with and creates error messages that will be relatyed through the frontend_interface and out to the frontend.
#
# Author: E.Omer Gul, Jasper Na

from psycopg2 import errors as psycoErr
import re


class ErrorCodes:

    # GENERIC ERRORS (0-4)
    CODE_SUCCESS = 0
    CODE_SUCCESS_NAME = "CODE_SUCCESS"
    CODE_SUCCESS_DESC = "Operation Successful"
    CODE_FAILURE = 1
    CODE_FAILURE_NAME = "CODE_FAILURE"
    CODE_FAILURE_DESC = "An Unresolved Error Occured"

    # LOGIN/AUTHENTCATION ERROR (5-9)
    CODE_INCORRECT_EMAIL_PASS = 5
    CODE_INCORRECT_EMAIL_PASS_NAME = "CODE_INCORRECT_EMAIL_PASS"
    CODE_INCORRECT_EMAIL_PASS_DESC = "Email or Password is incorrect"

    # USER ERROR (10-14)
    CODE_EMAIL_TAKEN = 10
    CODE_EMAIL_TAKEN_NAME = "CODE_EMAIL_TAKEN"
    CODE_EMAIL_TAKEN_DESC = "An account with this Email already exists in the Database (Email must be unique!)"
    CODE_USERNAME_TAKEN = 11
    CODE_USERNAME_TAKEN_NAME = "CODE_USERNAME_TAKEN"
    CODE_USERNAME_TAKEN_DESC = "An account with this Username already exists in the Database (Username must be unique!)"
    CODE_PHONE_TAKEN = 12
    CODE_PHONE_TAKEN_NAME = "CODE_PHONE_TAKEN"
    CODE_PHONE_TAKEN_DESC = "An account with this Phone number already exists in the Database (Phone must be unique!)"
    CODE_INVALID_BSB_FORMAT = 13
    CODE_INVALID_BSB_FORMAT_NAME = "CODE_INVALID_BSB_FORMAT_NAME"
    CODE_INVALID_BSB_FORMAT_DESC = "Supplied BSB does not have format '000-000'"
    CODE_INVALID_ACCNUM_FORMAT = 14
    CODE_INVALID_ACCNUM_FORMAT_NAME = "CODE_INVALID_ACCNUM_FORMAT_NAME"
    CODE_INVALID_ACCNUM_FORMAT_DESC = "Account Number can only contain digits"

    # LISTING ERRORS (15-19)
    CODE_ADDRESS_TAKEN = 15
    CODE_ADDRESS_TAKEN_NAME = "CODE_ADDRESS_TAKEN"
    CODE_ADDRESS_TAKEN_DESC = "A seperate listing has already listed this address"
    CODE_UNABLE_TO_GEOTAG = 16
    CODE_UNABLE_TO_GEOTAG_NAME = "CODE_UNABLE_TO_GEOTAG"
    CODE_UNABLE_TO_GEOTAG_DESC = "Given listing address was unable to be converted to geotag coordinates which would render listing invisble to searches"
    CODE_INVALID_HOURLY_PRICE = 17
    CODE_INVALID_HOURLY_PRICE_NAME = "CODE_INVALID_HOURLY_PRICE"
    CODE_INVALID_HOURLY_PRICE_DESC = (
        "Hourly Price for a listing must be greater than $0"
    )
    CODE_INVALID_STREET_NUM = 18
    CODE_INVALID_STREET_NUM_NAME = "CODE_INVALID_STREET_NUM"
    CODE_INVALID_STREET_NUM_DESC = (
        "Street Number must be a Positive Numeric Value i.e. '1' not 'one'"
    )

    # BOOKING ERRORS (20-24)
    CODE_LISTING_BOOKED_AT_THIS_TIME = 20
    CODE_LISTING_BOOKED_AT_THIS_TIME_NAME = "CODE_LISTING_BOOKED_AT_THIS_TIME"
    CODE_LISTING_BOOKED_AT_THIS_TIME_DESC = (
        "The space already has a booking within the given time frame"
    )

    # REVIEW ERRORS (25-29)
    CODE_UNKNOWN_REVIEWER = 25
    CODE_UNKNOWN_REVIEWER_NAME = "CODE_UNKNOWN_REVIEWER"
    CODE_UNKNOWN_REVIEWER_DESC = "UserID owner of the Booking cannot be found. Valid user/username is required to post a Review."
    CODE_UNKNOWN_BOOKING = 26
    CODE_UNKNOWN_BOOKING_NAME = "CODE_UNKNOWN_BOOKING"
    CODE_UNKNOWN_BOOKING_DESC = "Corresponding booking cannot be found in the database. A valid booking is required to post a Review"
    CODE_PAST_BOOKINGS_ONLY = 27
    CODE_PAST_BOOKINGS_ONLY_NAME = "CODE_PAST_BOOKINGS_ONLY"
    CODE_PAST_BOOKINGS_ONLY_DESC = (
        "Only bookings made with a End Date before current time can post a review"
    )

    # OTHER DATABASE ERRORS (30-39)
    CODE_TAKEN = 30
    CODE_TAKEN_NAME = "CODE_TAKEN"
    CODE_TAKEN_DESC = ""

    CODE_NO_RESULTS = 31
    CODE_NO_RESULTS_NAME = "CODE_NO_RESULTS"
    CODE_NO_RESULTS_DESC = ""

    CODE_NO_MATCHING_ID = 32
    CODE_NO_MATCHING_ID_NAME = "CODE_NO_MATCHING_ID"
    CODE_NO_MATCHING_ID_DESC = (
        "No record in the database exists under give ID (Human Error if testing API)"
    )

    CODE_NOTHING_TO_UPDATE = 33
    CODE_NOTHING_TO_UPDATE_NAME = "CODE_NOTHING_TO_UPDATE"
    CODE_NOTHING_TO_UPDATE_DESC = (
        "No changes between old and new database records. Call to update has no effect."
    )

    CODE_TAKEN = 50  # if its a unique violation but we dont know what

    CODE_CHECK_VIOLATION = 99  # an check (trigger -> procedure) was violated in db

    # SEARCH ERRORS (40-44)
    CODE_UNABLE_TO_GEOTAG_SEARCH = 40
    CODE_UNABLE_TO_GEOTAG_SEARCH_NAME = "CODE_UNABLE_TO_GEOTAG_SEARCH"
    CODE_UNABLE_TO_GEOTAG_SEARCH_DESC = "Given search term (i.e. suburb) was unable to be resolved into any geotag coordinates."

    @staticmethod
    def psycopg2_expection_handler(e: Exception):
        if type(e) == psycoErr.UniqueViolation:
            return ErrorCodes.handle_unique_violation(e.__str__())
        if type(e) == psycoErr.CheckViolation:
            return ErrorCodes.handle_check_violation(e.__str__())

    @staticmethod
    # Maps corresponding database insertion checks into corresponding error codes
    # Check violations are raised when invalid data is attempted to be inserted in the database
    def handle_check_violation(error_string: str):
        try:
            # check violation will have format: Error_string was : new row for relation "users" violates check constraint "users_accountnum_check"
            rgx = re.findall('"(.+?)"', error_string)
            if rgx:
                violated_table = rgx[0]
                violation_name = rgx[1]
                print(f"Check on {violated_table} violated by {violation_name}")

                if violation_name == "availability":
                    return ErrorCodes.CODE_LISTING_BOOKED_AT_THIS_TIME

                # listing related
                if violation_name == "listings_hourlyprice_check":
                    return ErrorCodes.CODE_INVALID_HOURLY_PRICE
                elif violation_name == "listings_streetnumber_check":
                    return ErrorCodes.CODE_INVALID_STREET_NUM

                # user related
                if violation_name == "users_bsb_check":
                    return ErrorCodes.CODE_INVALID_BSB_FORMAT
                elif violation_name == "users_accountnum_check":
                    return ErrorCodes.CODE_INVALID_ACCNUM_FORMAT

            return ErrorCodes.CODE_CHECK_VIOLATION

        except Exception as e:
            print(f"Unknown error occured extracting the database Check Violation {e}")
            return ErrorCodes.CODE_FAILURE

    @staticmethod
    # Decodes database uniqueness violation errors into coresponding Error codes
    def handle_unique_violation(error_string: str):
        msg = re.search("\((.*?)\)", error_string)

        if msg:
            ret = msg.group(1)
            if ret == "username":
                code = ErrorCodes.CODE_USERNAME_TAKEN
            elif ret == "phoneno":
                code = ErrorCodes.CODE_PHONE_TAKEN
            elif ret == "streetnumber, street, suburb, postcode":
                code = ErrorCodes.CODE_ADDRESS_TAKEN
            elif ret == "bookedby, bookedspace, startdate, enddate":
                code = ErrorCodes.CODE_LISTING_BOOKED_AT_THIS_TIME
            else:
                code = ErrorCodes.CODE_TAKEN
            return code
        return "ERROR STRING NON EXISTENT"
