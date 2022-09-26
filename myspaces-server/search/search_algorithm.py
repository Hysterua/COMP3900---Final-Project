# Version: python:3.8
#
# Name: search_algorithm.py
#
# Description: This file implements the search algorithm used to search for car spaces basead on varous parameters such as distance, price, car space size, etc.
#
# Author: Jasper Na


from data_class.direction_api_cache import DirectionAPICache
from data_class.listing import Listing
from data_class.booking import Booking
from data_class.dataobject import DataObject
from datetime import datetime
from .distance_mapper import DistanceMapper
from dotenv import load_dotenv, find_dotenv
from datetime import datetime, date, timedelta
import json
from requests import request
import os


class SearchAlgorithm:
    @staticmethod
    # function searches surrounding suburb for relevant listings
    # Returns a list of Listings sorted by most relevant
    # Returns an empty list if no apprioriate listings
    # Returns None on error/failure
    def search_listings(
        suburb: str,
        booking_start: str,
        booking_end: str,
        cost: int = 0,
        length: float = 0.0,
        width: float = 0.0,
        height: float = 0.0,
    ):
        geocode = DistanceMapper.suburb_to_geocode(suburb)
        if geocode is None:
            print(
                f"[ERR] Requested search subrub was unable to resolved into geocode. Listing search abandoned."
            )
            return None
        [lat_src, long_src] = geocode

        listings: list[Listing] = Listing.get_all_listings(
            include_hidden=False, include_deleted=False
        )
        listings = SearchAlgorithm.filter_listings_by_radius(
            listings, lat_src, long_src, max_r=3.0
        )
        listings = SearchAlgorithm.filter_listings_by_attributes(
            listings, cost, width, height, length
        )
        listings = SearchAlgorithm.filter_listings_by_availability(
            listings, booking_start, booking_end
        )

        sorted_listings = SearchAlgorithm.sort_listings_by_distances(
            listings, lat_src, long_src
        )

        # Closest 3 will be recommended, others will be remaining
        if len(sorted_listings) < 3:
            return sorted_listings, []
        return sorted_listings[:3], sorted_listings[3:]

    @staticmethod
    # function searches surrounding neighbouring suburbs and computes their public transport
    # times to search suburb. Listings with the three lowest route duration are returned
    # Returns an empty list if no apprioriate listings
    # Returns None on error/failure
    def search_with_public_transit(
        suburb: str,
        booking_start: str,
        booking_end: str,
        cost: int = 0,
        length: float = 0.0,
        width: float = 0.0,
        height: float = 0.0,
    ):
        geocode = DistanceMapper.suburb_to_geocode(suburb)
        if geocode is None:
            print(
                f"[ERR] Requested search suburb was unable to resolved into geocode. Listing search abandoned."
            )
            return None
        [lat_src, long_src] = geocode

        listings: list[Listing] = Listing.get_all_listings(
            include_hidden=False, include_deleted=False
        )
        # get all listings within a 4 to 10 km radius from suburb
        filtered = SearchAlgorithm.filter_listings_by_radius(
            listings, lat_src, long_src, max_r=10.0, min_r=4.0
        )
        filtered = SearchAlgorithm.filter_listings_by_attributes(
            filtered, cost, width, height, length
        )
        filtered = SearchAlgorithm.filter_listings_by_availability(
            filtered, booking_start, booking_end
        )

        pt_times = []
        for listings in filtered:
            res = SearchAlgorithm.resolve_pt_time(listings, suburb)
            if res is not None:
                pt_times.append(res)
        pt_times.sort(key=lambda cached: cached.Duration)

        # Slices will go to n, or list length, whichever is shorter
        results = []
        for listings in pt_times[:3]:
            print(
                f"Try this PT {listings.ListingID} d:{listings.Duration}, dist:{listings.Distance} s:{listings.TransitMethod}"
            )
            temp = Listing.get_listing(listings.ListingID)
            print(
                f"This got a straight line of {DistanceMapper.straight_distance(lat_src, long_src, temp.Latitude, temp.Longitude)}"
            )
            results.append(SearchResultWithPT(temp, listings))
        return results

    @staticmethod
    # Function returns a list of listings that satisfy distances within min_r -> max_r
    def filter_listings_by_radius(
        listings, lat_src, long_src, max_r: int, min_r: int = 0
    ):
        filtered = list(
            filter(
                lambda l: DistanceMapper.straight_distance(
                    lat_src, long_src, l.Latitude, l.Longitude
                )
                <= max_r,
                listings,
            )
        )
        if min_r > 0:
            filtered = list(
                filter(
                    lambda l: DistanceMapper.straight_distance(
                        lat_src, long_src, l.Latitude, l.Longitude
                    )
                    >= min_r,
                    filtered,
                )
            )
        return filtered

    @staticmethod
    # Function returns a list of listings that satisfy dimension constraints along with maximum costs
    def filter_listings_by_attributes(
        listings, cost: int, width: float, height: float, length: float
    ):
        if cost > 0:
            listings = list(filter(lambda l: l.HourlyPrice <= cost, listings))
        return list(
            filter(
                lambda l: (l.Width >= width)
                and (l.Height >= height)
                and (l.Depth >= length),
                listings,
            )
        )

    @staticmethod
    # Function filters listings by availability such that no returned listing has overlapping
    # bookings between booking_start and booking_end
    def filter_listings_by_availability(listings, booking_start: str, booking_end: str):
        results = []
        try:
            formatted_start = datetime.strptime(
                booking_start[4:-44], "%b %d %Y %H:%M:%S"
            )
            formatted_end = datetime.strptime(booking_end[4:-44], "%b %d %Y %H:%M:%S")
        except:
            print(f"Something went wrong with setting the date correctly")

        for listing_itr in listings:
            listing_id = listing_itr.ListingID
            # Get the booking object for the listingID
            booking_object = DataObject.get_object(
                Booking, f"{Booking.LISTING_REFERENCE_COL_NAME} = {listing_id}"
            )
            # If the booking object isn't empty then
            if booking_object == None:
                results.append(listing_itr)
            else:
                try:
                    c = 0
                    for i in booking_object:
                        pulled_booking_start = datetime.strptime(
                            i.StartDate, "%Y-%m-%d %H:%M:%S"
                        )
                        pulled_booking_end = datetime.strptime(
                            i.EndDate, "%Y-%m-%d %H:%M:%S"
                        )

                        if (
                            pulled_booking_start > formatted_start
                            and pulled_booking_start < formatted_end
                        ):
                            c = 1

                        elif (
                            pulled_booking_end > formatted_start
                            and pulled_booking_end < formatted_end
                        ):
                            c = 1

                    if c == 0:
                        results.append(listing_itr)

                except:
                    print("Could not use multiple listing formula")

                try:
                    pulled_booking_start = datetime.strptime(
                        booking_object.StartDate, "%Y-%m-%d %H:%M:%S"
                    )
                    pulled_booking_end = datetime.strptime(
                        booking_object.EndDate, "%Y-%m-%d %H:%M:%S"
                    )

                    if (
                        pulled_booking_start > formatted_start
                        and pulled_booking_start < formatted_end
                    ):
                        pass

                    elif (
                        pulled_booking_end > formatted_start
                        and pulled_booking_end < formatted_end
                    ):
                        pass

                    else:
                        results.append(listing_itr)
                except:
                    print("Could not use single listing formula")
        return results

    @staticmethod
    # Returns a list of listings sorted by their straight distances to the lat/long argument
    def sort_listings_by_distances(listings, lat_src, long_src):
        # Compute distance from suburb
        results = []
        for listing_itr in listings:
            results.append(
                (
                    DistanceMapper.straight_distance(
                        lat_src, long_src, listing_itr.Latitude, listing_itr.Longitude
                    ),
                    listing_itr,
                )
            )

        # Sort by distance from suburb
        return_res = []
        results.sort(key=lambda tup: tup[0])
        for tuple_itr in results:
            # map listing to search result
            return_res.append(SearchResult(tuple_itr[1], tuple_itr[0]))
        return return_res

    @staticmethod
    # Function returns the average public transport commute between a given listing and end suburb
    # If a cache API result exists, this is returned, otherwise a new Google Routes API call is made, parsed, inserted into the database, and finally returned
    # Inputs are assumed to be wellformed as database insertion required a successful address mapping
    def resolve_pt_time(src: Listing, suburb: str):
        res = DirectionAPICache.get_cache(src.ListingID, suburb)
        if res is None:
            load_dotenv(find_dotenv(".secret.env"))  # load environment variables
            API_KEY = os.environ.get("GMAPS_API")
            # Average Public Transport Time based on Monday 12PM Noon
            MONDAY_NOON = SearchAlgorithm.get_next_monday_noon()
            url = f"https://maps.googleapis.com/maps/api/directions/json?origin={src.StreetNumber} {src.Street}, {src.Suburb} NSW {src.PostCode}, Australia&destination={suburb},%20NSW,%20Australia&mode=transit&transit_routing_preference=fewer_transfers&departure_time={MONDAY_NOON}&key={API_KEY}"
            response = request("GET", url, headers={}, data={})
            res = SearchAlgorithm.parse_distance_api_response(
                src.ListingID, suburb, response.text
            )
            if res is not None:
                DirectionAPICache.insert_new_cache(res)
        return res

    @staticmethod
    # Function extracts required information from the Google Routes API response
    # DirectionAPICache is returned on success, None otherwise
    def parse_distance_api_response(listing_id: int, suburb: str, response: str):
        try:
            directions = json.loads(response)
            if directions["status"] == "OK":
                leg = directions["routes"][0]["legs"][0]
                duration = int(leg["duration"]["value"] / 60)
                distance = float(leg["distance"]["value"] / 1000)
                polyline_summary = []
                method_summary = []
                summary = []
                for step in leg["steps"]:
                    if step["travel_mode"] == "TRANSIT":
                        method_summary.append(
                            step["transit_details"]["line"]["vehicle"]["type"]
                        )
                    else:
                        method_summary.append(step["travel_mode"])
                    polyline_summary.append(step["polyline"]["points"])
                    summary.append(
                        f'{step["html_instructions"]} ({step["duration"]["text"]})'
                    )

                # The Polyline encoder algorithm adds '?' value to everything. '!' < '?' and hence has been used as the delim
                polyline_summary = "!".join(polyline_summary)
                method_summary = "|".join(method_summary)
                summary = "|".join(summary)
                return DirectionAPICache(
                    listing_id,
                    suburb,
                    duration,
                    distance,
                    method_summary,
                    summary,
                    polyline_summary,
                    datetime.now(),
                )
            else:
                print(f'Google Maps API call failed, status was {directions["status"]}')
                return None
        except Exception as e:
            print(f"An error occured parsing Google Distance API response {e}")
            return None

    @staticmethod
    # Specifies the desired time of arrival for transit directions, in seconds since midnight, January 1, 1970 UTC.
    # Returns the next avaliable monday
    def get_next_monday_noon():
        GMT_OFFSET = 10
        from_date = date.today() + timedelta(
            days=1
        )  # Do not include today's date if today is Monday
        from_date = datetime(from_date.year, from_date.month, from_date.day)
        temp = from_date + timedelta(
            days=(0 - from_date.weekday() + 7) % 7, hours=12 - GMT_OFFSET
        )
        return int((temp - datetime(1970, 1, 1)).total_seconds())


# Simple dataclass to match FastAPI Reponse object
class SearchResult(Listing):
    def __init__(self, ListingObj: Listing, Distance: float):
        super().__init__(*ListingObj.__dict__.values())
        self.Distance = Distance


# Simple dataclass to match FastAPI Reponse object
class SearchResultWithPT(Listing):
    def __init__(self, ListingObj: Listing, pt: DirectionAPICache):
        super().__init__(*ListingObj.__dict__.values())
        self.SuburbSearched = pt.Suburb
        self.Duration = pt.Duration
        self.Distance = pt.Distance
        self.TransitMethod = pt.TransitMethod
        self.TransitSummary = pt.TransitSummary
        self.Polyline = pt.Polyline
