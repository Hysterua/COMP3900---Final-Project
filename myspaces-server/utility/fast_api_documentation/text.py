# Version: python:3.8
#
# Name: text.py
#
# Description: FastAPI Documentation seperated to clean up main.py
#
# Author: Jasper Na

from utility.error_codes import ErrorCodes


fast_api_description = f"""
MySpaces FastAPI Internal Documentation for Frontend Developer reference 🚀

Exposing API endpoints for internal use will allow frontend to never have to touch a single line of Python! 🐍

For database operations, a resource (e.g. User) will now be under a singular route (e.g. /user/) in which different HTTP methods will be allowed.
A general rule of thumb is:
- **GET** is used to **get** a record
- **POST** is used to **insert** a new record
- **PUT** is used to **update** an existing record
- **DELETE** is used to **delete** an existing record from the database

Not all resources allow for all four HTTP methods. If you believe a resource requires a HTTP method not listed, **contact Omer/Jasper**, no need to touch main.py 😘.

Expanding each HTTP method below will show what **Request Body** is expected.
A general rule of thumb is:
- **GET/DELETE** HTTP methods will often take a singular record ID as a URL parameter.
- **POST/PUT** HTTP methods will often need multiple fields to be sent in the form as a object in the request body.

Under each HTTP method will show the Response Object to be returned.
Most responses will have structure
```
"ErrorCode": an errorcode
"Payload": data to be returned
```

#### Error Codes:
|Error Code|Error Name|Description|
|:---:|:---:|:---:|
|{ErrorCodes.CODE_SUCCESS}|{ErrorCodes.CODE_SUCCESS_NAME}|{ErrorCodes.CODE_SUCCESS_DESC}|
|{ErrorCodes.CODE_FAILURE}|{ErrorCodes.CODE_FAILURE_NAME}|{ErrorCodes.CODE_FAILURE_DESC}|
|{ErrorCodes.CODE_INCORRECT_EMAIL_PASS}|{ErrorCodes.CODE_INCORRECT_EMAIL_PASS_NAME}|{ErrorCodes.CODE_INCORRECT_EMAIL_PASS_DESC}|
|{ErrorCodes.CODE_EMAIL_TAKEN}|{ErrorCodes.CODE_EMAIL_TAKEN_NAME}|{ErrorCodes.CODE_EMAIL_TAKEN_DESC}|
|{ErrorCodes.CODE_USERNAME_TAKEN}|{ErrorCodes.CODE_USERNAME_TAKEN_NAME}|{ErrorCodes.CODE_USERNAME_TAKEN_DESC}|
|{ErrorCodes.CODE_PHONE_TAKEN}|{ErrorCodes.CODE_PHONE_TAKEN_NAME}|{ErrorCodes.CODE_PHONE_TAKEN_DESC}|
|{ErrorCodes.CODE_INVALID_BSB_FORMAT}|{ErrorCodes.CODE_INVALID_BSB_FORMAT_NAME}|{ErrorCodes.CODE_INVALID_BSB_FORMAT_DESC}|
|{ErrorCodes.CODE_INVALID_ACCNUM_FORMAT}|{ErrorCodes.CODE_INVALID_ACCNUM_FORMAT_NAME}|{ErrorCodes.CODE_INVALID_ACCNUM_FORMAT_DESC}|
|{ErrorCodes.CODE_ADDRESS_TAKEN}|{ErrorCodes.CODE_ADDRESS_TAKEN_NAME}|{ErrorCodes.CODE_ADDRESS_TAKEN_DESC}|
|{ErrorCodes.CODE_UNABLE_TO_GEOTAG}|{ErrorCodes.CODE_UNABLE_TO_GEOTAG_NAME}|{ErrorCodes.CODE_UNABLE_TO_GEOTAG_DESC}|
|{ErrorCodes.CODE_INVALID_HOURLY_PRICE}|{ErrorCodes.CODE_INVALID_HOURLY_PRICE_NAME}|{ErrorCodes.CODE_INVALID_HOURLY_PRICE_DESC}|
|{ErrorCodes.CODE_INVALID_STREET_NUM}|{ErrorCodes.CODE_INVALID_STREET_NUM_NAME}|{ErrorCodes.CODE_INVALID_STREET_NUM_DESC}|
|{ErrorCodes.CODE_LISTING_BOOKED_AT_THIS_TIME}|{ErrorCodes.CODE_LISTING_BOOKED_AT_THIS_TIME_NAME}|{ErrorCodes.CODE_LISTING_BOOKED_AT_THIS_TIME_DESC}|
|{ErrorCodes.CODE_UNKNOWN_REVIEWER}|{ErrorCodes.CODE_UNKNOWN_REVIEWER_NAME}|{ErrorCodes.CODE_UNKNOWN_REVIEWER_DESC}|
|{ErrorCodes.CODE_UNKNOWN_BOOKING}|{ErrorCodes.CODE_UNKNOWN_BOOKING_NAME}|{ErrorCodes.CODE_UNKNOWN_BOOKING_DESC}|
|{ErrorCodes.CODE_PAST_BOOKINGS_ONLY}|{ErrorCodes.CODE_PAST_BOOKINGS_ONLY_NAME}|{ErrorCodes.CODE_PAST_BOOKINGS_ONLY_DESC}|
|{ErrorCodes.CODE_TAKEN}|{ErrorCodes.CODE_TAKEN_NAME}|{ErrorCodes.CODE_TAKEN_DESC}|
|{ErrorCodes.CODE_NO_RESULTS}|{ErrorCodes.CODE_NO_RESULTS_NAME}|{ErrorCodes.CODE_NO_RESULTS_DESC}|
|{ErrorCodes.CODE_NO_MATCHING_ID}|{ErrorCodes.CODE_NO_MATCHING_ID_NAME}|{ErrorCodes.CODE_NO_MATCHING_ID_DESC}|
|{ErrorCodes.CODE_NOTHING_TO_UPDATE}|{ErrorCodes.CODE_NOTHING_TO_UPDATE_NAME}|{ErrorCodes.CODE_NOTHING_TO_UPDATE_DESC}|
|{ErrorCodes.CODE_UNABLE_TO_GEOTAG_SEARCH}|{ErrorCodes.CODE_UNABLE_TO_GEOTAG_SEARCH_NAME}|{ErrorCodes.CODE_UNABLE_TO_GEOTAG_SEARCH_DESC}|

Note: Successful calls will always return {ErrorCodes.CODE_SUCCESS_NAME} ({ErrorCodes.CODE_SUCCESS})
FastAPI Documentation maintained by Jasper Gul and Ertugrul Na
"""

# |{ErrorCodes.CODE_X}|{ErrorCodes.CODE_X_NAME}|{ErrorCodes.CODE_X_DESC}|

user_description = f"""
* **get_user** returns code: {ErrorCodes.CODE_NO_RESULTS_NAME} ({ErrorCodes.CODE_NO_RESULTS}), {ErrorCodes.CODE_FAILURE_NAME} ({ErrorCodes.CODE_FAILURE})
* **get_user_listings** returns code: {ErrorCodes.CODE_NO_MATCHING_ID_NAME} ({ErrorCodes.CODE_NO_MATCHING_ID})
* **get_user_bookings** returns code: {ErrorCodes.CODE_NO_MATCHING_ID_NAME} ({ErrorCodes.CODE_NO_MATCHING_ID})
* **insert_user** returns code: 
* **update_user** returns code: {ErrorCodes.CODE_INVALID_BSB_FORMAT_NAME} ({ErrorCodes.CODE_INVALID_BSB_FORMAT}) {ErrorCodes.CODE_INVALID_ACCNUM_FORMAT_NAME} ({ErrorCodes.CODE_INVALID_ACCNUM_FORMAT})
"""
listing_description = f"""
* **get_listing** returns code: {ErrorCodes.CODE_NO_RESULTS_NAME} ({ErrorCodes.CODE_NO_RESULTS}), {ErrorCodes.CODE_FAILURE_NAME} ({ErrorCodes.CODE_FAILURE})
* **get_listing_bookings** returns code: {ErrorCodes.CODE_NO_MATCHING_ID_NAME} ({ErrorCodes.CODE_NO_MATCHING_ID})
* **get_listing_reviews** returns code: {ErrorCodes.CODE_NO_MATCHING_ID_NAME} ({ErrorCodes.CODE_NO_MATCHING_ID})
* **insert_new_listing** returns code: {ErrorCodes.CODE_NO_MATCHING_ID_NAME} ({ErrorCodes.CODE_NO_MATCHING_ID}), {ErrorCodes.CODE_ADDRESS_TAKEN_NAME} ({ErrorCodes.CODE_ADDRESS_TAKEN}), {ErrorCodes.CODE_UNABLE_TO_GEOTAG_NAME} ({ErrorCodes.CODE_UNABLE_TO_GEOTAG})
* **update_listing** returns code: {ErrorCodes.CODE_NO_MATCHING_ID_NAME} ({ErrorCodes.CODE_NO_MATCHING_ID})
* **delete_listing** returns code: {ErrorCodes.CODE_NO_MATCHING_ID_NAME} ({ErrorCodes.CODE_NO_MATCHING_ID})
"""
booking_description = f"""
* **get_booking** returns code: {ErrorCodes.CODE_NO_RESULTS_NAME} ({ErrorCodes.CODE_NO_RESULTS}), {ErrorCodes.CODE_FAILURE_NAME} ({ErrorCodes.CODE_FAILURE})
* **insert_new_booking** returns code: {ErrorCodes.CODE_NO_MATCHING_ID_NAME} ({ErrorCodes.CODE_NO_MATCHING_ID}), {ErrorCodes.CODE_LISTING_BOOKED_AT_THIS_TIME_NAME} ({ErrorCodes.CODE_LISTING_BOOKED_AT_THIS_TIME})
* **delete_booking** returns code: {ErrorCodes.CODE_NO_MATCHING_ID_NAME} ({ErrorCodes.CODE_NO_MATCHING_ID})
"""
review_description = f"""
* **get_review** returns code: {ErrorCodes.CODE_NO_RESULTS_NAME} ({ErrorCodes.CODE_NO_RESULTS}), {ErrorCodes.CODE_FAILURE_NAME} ({ErrorCodes.CODE_FAILURE})
* **insert_new_review** returns code: {ErrorCodes.CODE_UNKNOWN_BOOKING_NAME} {ErrorCodes.CODE_UNKNOWN_REVIEWER_NAME} {ErrorCodes.CODE_PAST_BOOKINGS_ONLY_NAME}
* **update_review** returns code: {ErrorCodes.CODE_NO_MATCHING_ID_NAME} ({ErrorCodes.CODE_NO_MATCHING_ID})
* **delete_review** returns code: {ErrorCodes.CODE_NO_MATCHING_ID_NAME} ({ErrorCodes.CODE_NO_MATCHING_ID})
"""
search_description = f"""
* **search_for_listings** returns code: {ErrorCodes.CODE_UNABLE_TO_GEOTAG_SEARCH_NAME} ({ErrorCodes.CODE_UNABLE_TO_GEOTAG_SEARCH})
* **search_for_listings_with_transit** returns code: {ErrorCodes.CODE_UNABLE_TO_GEOTAG_SEARCH_NAME} ({ErrorCodes.CODE_UNABLE_TO_GEOTAG_SEARCH})
"""
authentication_description = f"""
* **authenticate_user** returns code: {ErrorCodes.CODE_INCORRECT_EMAIL_PASS_NAME} ({ErrorCodes.CODE_INCORRECT_EMAIL_PASS})
"""

tags_metadata = [
    {"name": "User", "description": user_description},
    {"name": "Listings", "description": listing_description},
    {"name": "Bookings", "description": booking_description},
    {"name": "Reviews", "description": review_description},
    {"name": "Authentication", "description": authentication_description},
    {"name": "Search", "description": search_description},
    {"name": "Schmiko", "description": "Used for Car Wash add on"}
]
