# Version: python:3.8
#
# Name: frontend_objects.py
#
# Description: Used to enforce formatting of inputs and outputs in main.py.
#
# Author: Jasper Na


from typing import Union, List
from pydantic import BaseModel


class ResponseObject(BaseModel):
    ErrorCode: int


# -------------------------------------
#   User Management Data Objects
# -------------------------------------

# GET Retrieve User
# GetUser takes in a user_id as a int argument
class GetUserResponsePayload(BaseModel):
    UserID: int
    Username: str
    Email: str
    FirstName: str
    LastName: str
    PhoneNo: int
    IsAdmin: bool
    BSB: str
    AccountNum: str


class GetUserResponse(ResponseObject):
    Payload: Union[GetUserResponsePayload, None]


# GET Retrieve All Users

# no GetAllUserRequest object
class GetAllUserResponse(ResponseObject):
    Payload: Union[List[GetUserResponsePayload], None]


# POST Insert User
class PostUserRequest(BaseModel):
    Username: str
    UserPassword: str
    Email: str
    FirstName: str
    LastName: str
    PhoneNo: int
    IsAdmin: bool


# PostUserResponse is simply a Response Object

# PUT Update User
class PutUserRequest(BaseModel):
    UserID: int
    FirstName: str
    LastName: str
    PhoneNo: int
    BSB: str
    AccountNum: str


# PutUserResponse is simply a Response Object

# -------------------------------------
#   Listing Management Data Objects
# -------------------------------------

# GET Retrieve Listing
# GetListing takes in a listing_id as an int argument
class GetListingResponsePayload(BaseModel):
    ListingID: int
    ListedBy: int
    HourlyPrice: int
    Notes: str
    StreetNumber: int
    Street: str
    Suburb: str
    PostCode: int
    Width: float
    Height: float
    Depth: float
    Latitude: float
    Longitude: float
    Visible: bool
    Deleted: int


class GetListingResponse(ResponseObject):
    Payload: Union[GetListingResponsePayload, None]


# GET Retrieve All Listings
# no GetAllListingRequest object
class GetAllListingResponse(ResponseObject):
    Payload: Union[List[GetListingResponsePayload], None]


# POST Insert Listing
class PostListingRequest(BaseModel):
    ListedBy: int
    HourlyPrice: int
    Notes: str
    StreetNumber: int
    Street: str
    Suburb: str
    PostCode: int
    Width: float
    Height: float
    Depth: float
    Visible: bool


# PostListingResponse is simply a Response Object

# PUT Update Listing
class PutListingRequest(BaseModel):
    ListingID: int
    ListedBy: int
    HourlyPrice: int
    Notes: str
    StreetNumber: int
    Street: str
    Suburb: str
    PostCode: int
    Width: float
    Height: float
    Depth: float
    Visible: bool


# PutListingResponse is simply a Response Object

# DELETE Listings


# -------------------------------------
#   Booking Management Data Objects
# -------------------------------------

# GET Retrieve Booking
# GetBooking takes in a booking_id as an int argument
class GetBookingResponsePayload(BaseModel):
    BookingID: int
    BookedBy: int
    BookedSpace: int
    StartDate: str
    EndDate: str
    TotalCost: float


class GetBookingResponse(ResponseObject):
    Payload: Union[GetBookingResponsePayload, None]


# GET Retrieve All Bookings
# no GetAllBookingsRequest object
class GetAllBookingResponse(ResponseObject):
    Payload: Union[List[GetBookingResponsePayload], None]


# POST Insert Booking
class PostBookingRequest(BaseModel):
    BookedBy: int
    BookedSpace: int
    StartDate: str
    EndDate: str
    TotalCost: float
    Plate: str
    CardNo: str
    CardExpiry: str
    SecurityCode: str


# PostBookingResponse is simply a Response Object

# PUT Update Booking
# No need to update bookings

# DELETE Booking
# DeleteBooking takes in a booking_id as an int argument
# DeleteBookingResponse is simply a Response Object

# -------------------------------------
#   Review Management Data Objects
# -------------------------------------

# GET Retrieve Review
# GetReview takes in a review_id as an int argument
class GetReviewResponsePayload(BaseModel):
    ReviewID: int
    BookingID: int
    ReviewedListing: int
    Username: str
    Liked: bool
    Comment: str


class GetReviewResponse(ResponseObject):
    Payload: Union[GetReviewResponsePayload, None]


# GET Retrieve All Reviews
# no GetAllListingRequest object
class GetAllReviewResponse(ResponseObject):
    Payload: Union[List[GetReviewResponsePayload], None]


# POST Insert Review
# PostReviewResponse is simply a Response Object
class PostReviewRequest(BaseModel):
    BookingID: int
    Liked: bool
    Comment: str


# PUT Update Review
class PutReviewRequest(BaseModel):
    ReviewID: int
    Liked: bool
    Comment: str


# PutReviewResponse is simply a Response Object

# DELETE Review
# DeleteReviewRequest takes in a booking_id as an int argument
# DeleteReviewResponse is simply a Response Object

# -------------------------------------
#   Database Queries Data Objects
# -------------------------------------

# GET User's Listings
# GetUserListingsRequest is simply a client_id argument
class GetUserListingsResponse(ResponseObject):
    Payload: Union[List[GetListingResponsePayload], None]


# GET User's Bookings
# GetUserBookingsRequest is simply a client_id argument
class GetUserBookingsResponsePayload(BaseModel):
    Previous: List[GetBookingResponsePayload]
    Future: List[GetBookingResponsePayload]


class GetUserBookingsResponse(ResponseObject):
    Payload: Union[GetUserBookingsResponsePayload, None]


# GET Listing's Bookings
# GetListingBookingsRequest is simply a client_id argument
class GetListingBookingsResponse(ResponseObject):
    Payload: Union[List[GetBookingResponsePayload], None]


# GET Listing's Reviews
# GetListingReviewsRequest is simply a client_id argument
class GetCommentResponsePayload(BaseModel):
    Username: str
    Comment: str


class GetListingReviewsResponsePayload(BaseModel):
    TotalLikes: int
    Comments: List[GetCommentResponsePayload]


class GetListingReviewsResponse(ResponseObject):
    Payload: Union[GetListingReviewsResponsePayload, None]


# GET Booking's Review
# GetListingBookingsRequest is simply a client_id argument
class GetBookingsReviewResponse(ResponseObject):
    Payload: Union[GetReviewResponsePayload, None]


# -------------------------------------
#   User Authentication Dataobjects
# -------------------------------------


class PostLoginRequest(BaseModel):
    Email: str
    Password: str


class PostLoginResponse(ResponseObject):
    Payload: Union[GetUserResponsePayload, None]


# -------------------------------------
#   Search Dataobjects
# -------------------------------------

# Listing Response with Distance from Search Suburb
class GetSearchResponsePayload(GetListingResponsePayload):
    Distance: float


class PostSearchResponsePayload(BaseModel):
    Recommended: List[GetSearchResponsePayload]
    Remaining: List[GetSearchResponsePayload]


class GetSearchResponse(ResponseObject):
    Payload: Union[PostSearchResponsePayload, None]


# Searching with Transit
class getDirectionsAPIResponsePayload(BaseModel):
    ListingID: int
    Suburb: str
    Duration: int
    Distance: float
    TransitMethod: str
    TransitSummary: str
    Polyline: str


class getDirectionsAPIResponse(ResponseObject):
    Payload: Union[getDirectionsAPIResponsePayload, None]


class GetSearchWithTransitResponsePayload(GetListingResponsePayload):
    SuburbSearched: str
    Duration: int
    Distance: float
    TransitMethod: str
    TransitSummary: str
    Polyline: str


class GetSearchWithTransitResponse(ResponseObject):
    Payload: Union[List[GetSearchWithTransitResponsePayload], None]


class GetSchmikoDataPaylaod(BaseModel):
    Title: str
    Cost: str
    Features: str

class GetSchmikoDataResponse(ResponseObject):
    Payload: Union[List[GetSchmikoDataPaylaod],None]


class GetSchmikoAvailabilityPayload(BaseModel):
    BookingTimes: List[str]

class GetSchmikoAvailabilityResponse(ResponseObject):
    Payload: Union[List[GetSchmikoAvailabilityPayload], None]