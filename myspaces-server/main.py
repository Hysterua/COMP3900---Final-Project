# Version: python:3.8
#
# Name: main.py
#
# Description: This file contains the interface used to interact with the database. Documentation is provided using fast-api.
# Navigate to http://127.0.0.1:8000/docs#/ for documentation.
#
# Author: Jasper Na, E. Omer Gul


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data_class.frontend_objects import *
from utility.error_codes import ErrorCodes
from utility.frontend_interface import FrontEnd_Interface

from utility.fast_api_documentation.text import tags_metadata, fast_api_description

app = FastAPI(
    title="MySpaces Internal API",
    description=fast_api_description,
    version="0.0.2",
    openapi_tags=tags_metadata,
)
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Navigate to http://127.0.0.1:8000/docs#/ to see FastAPI documentation")

# -------------------------------------
#   User Database Management API Endpoints (Check FastAPI Documentation for more infromation)
# -------------------------------------


@app.get("/user/", tags=["User"], response_model=GetAllUserResponse)
async def get_all_users():
    return FrontEnd_Interface.get_all_users()


@app.get("/user/{user_id}", tags=["User"], response_model=GetUserResponse)
async def get_user(user_id: int):
    return FrontEnd_Interface.get_user(user_id)


# get all listings for a given user
@app.get(
    "/user/{user_id}/listings", tags=["User"], response_model=GetUserListingsResponse
)
async def get_user_listings(user_id: int):
    return FrontEnd_Interface.get_users_listings(user_id)


# Get all bookings for a given user
@app.get(
    "/user/{user_id}/bookings", tags=["User"], response_model=GetUserBookingsResponse
)
async def get_user_bookings(user_id: int):
    return FrontEnd_Interface.get_users_bookings(user_id)


@app.post("/user/", tags=["User"], response_model=ResponseObject)
async def insert_user(item: PostUserRequest):
    return FrontEnd_Interface.insert_new_user(item)


@app.put("/user/", tags=["User"], response_model=ResponseObject)
async def update_user(item: PutUserRequest):
    return FrontEnd_Interface.edit_user(item)


# -------------------------------------
#   Listing Database Management API Endpoints
# -------------------------------------


@app.get("/listings/", tags=["Listings"], response_model=GetAllListingResponse)
async def get_all_listing():
    return FrontEnd_Interface.get_all_listings()


@app.get("/listings/{listing_id}", tags=["Listings"], response_model=GetListingResponse)
async def get_listing(listing_id: int):
    return FrontEnd_Interface.get_listing(listing_id)


# Get all bookings for a given listing
@app.get(
    "/listings/{listing_id}/bookings",
    tags=["Listings"],
    response_model=GetListingBookingsResponse,
)
async def get_listing_bookings(listing_id: int):
    return FrontEnd_Interface.get_listings_bookings(listing_id)


# Get all reviews for a given listing
@app.get(
    "/listings/{listing_id}/reviews",
    tags=["Listings"],
    response_model=GetListingReviewsResponse,
)
async def get_listing_reviews(listing_id: int):
    return FrontEnd_Interface.get_listings_reviews(listing_id)


@app.get(
    "/listings/{listing_id}/pt",
    tags=["Listings"],
    response_model=getDirectionsAPIResponse,
)
async def get_listing_transit_info(listing_id: int, suburb: str):
    return FrontEnd_Interface.get_listing_transit_info(listing_id, suburb)


@app.post("/listings/", tags=["Listings"], response_model=ResponseObject)
async def insert_new_listing(item: PostListingRequest):
    return FrontEnd_Interface.insert_new_listing(item)


@app.put("/listings/", tags=["Listings"], response_model=ResponseObject)
async def update_listing(item: PutListingRequest):
    return FrontEnd_Interface.edit_listing(item)


@app.delete("/listings/{listing_id}", tags=["Listings"], response_model=ResponseObject)
async def delete_listing(listing_id: int):
    return FrontEnd_Interface.delete_listing(listing_id)


# -------------------------------------
#   Booking Database Management API Endpoints
# -------------------------------------


@app.get("/bookings/", tags=["Bookings"], response_model=GetAllBookingResponse)
async def get_all_bookings():
    return FrontEnd_Interface.get_all_bookings()


@app.get("/bookings/{booking_id}", tags=["Bookings"], response_model=GetBookingResponse)
async def get_booking(booking_id: int):
    temp = FrontEnd_Interface.get_booking(booking_id)
    print(f"About to send UP {temp}")
    for x in temp["Payload"]:
        print(f"{x} has type {type(x)}")
    return FrontEnd_Interface.get_booking(booking_id)


# Get all reviews for a given booking
@app.get(
    "/bookings/{bookings_id}/reviews",
    tags=["Bookings"],
    response_model=GetBookingsReviewResponse,
)
async def get_bookings_reviews(bookings_id: int):
    return FrontEnd_Interface.get_bookings_reviews(bookings_id)


@app.post("/bookings/", tags=["Bookings"], response_model=ResponseObject)
async def insert_new_booking(item: PostBookingRequest):
    return FrontEnd_Interface.insert_new_booking(item)


@app.delete("/bookings/{booking_id}", tags=["Bookings"], response_model=ResponseObject)
async def delete_booking(booking_id: int):
    return FrontEnd_Interface.delete_booking(booking_id)


# -------------------------------------
#   Review Database Management API Endpoints
# -------------------------------------


@app.get("/reviews/", tags=["Reviews"], response_model=GetAllReviewResponse)
async def get_all_reviews():
    return FrontEnd_Interface.get_all_reviews()


@app.get("/reviews/{review_id}", tags=["Reviews"], response_model=GetReviewResponse)
async def get_review(review_id: int):
    return FrontEnd_Interface.get_review(review_id)


@app.post("/reviews/", tags=["Reviews"], response_model=ResponseObject)
async def insert_new_review(item: PostReviewRequest):
    return FrontEnd_Interface.insert_new_review(item)


@app.put("/reviews/", tags=["Reviews"], response_model=ResponseObject)
async def update_review(item: PutReviewRequest):
    return FrontEnd_Interface.edit_review(item)


@app.delete("/reviews/{review_id}", tags=["Reviews"], response_model=ResponseObject)
async def delete_review(review_id: int):
    return FrontEnd_Interface.delete_review(review_id)


# -------------------------------------
#   User Authentication API Endpoints
# -------------------------------------


@app.post(
    "/user/authenticate", tags=["Authentication"], response_model=PostLoginResponse
)
async def authenticate_user(item: PostLoginRequest):
    return FrontEnd_Interface.authenticate_user(item)


# -------------------------------------
#   Listings Search  API Endpoints
# -------------------------------------


@app.get("/search/", tags=["Search"], response_model=GetSearchResponse)
async def search_for_listings(
    searchTerm: str,
    bookingStart: str,
    bookingFinish: str,
    cost: str = "0",
    length: str = "0.0",
    width: str = "0.0",
    height: str = "0.0",
):

    return FrontEnd_Interface.search_query(
        searchTerm, bookingStart, bookingFinish, cost, length, width, height
    )


@app.get("/search/pt/", tags=["Search"], response_model=GetSearchWithTransitResponse)
async def search_for_listings_with_transit(
    searchTerm: str,
    bookingStart: str,
    bookingFinish: str,
    cost: str = "0",
    length: str = "0.0",
    width: str = "0.0",
    height: str = "0.0",
):
    return FrontEnd_Interface.search_query_with_pt(
        searchTerm, bookingStart, bookingFinish, cost, length, width, height
    )


@app.get("/SchmickoData/", tags=["Schmiko"], response_model=GetSchmikoDataResponse)
async def pull_schmicko_data():
    return FrontEnd_Interface.pull_schmicko_data()



@app.get("/findSchmikoAvailability/", tags=["Schmiko"], response_model=GetSchmikoAvailabilityResponse)
async def find_schmiko_availability(date):
    return FrontEnd_Interface.find_schmiko_availability(date)