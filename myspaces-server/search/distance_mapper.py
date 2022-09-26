# Version: python:3.8
#
# Name: distance_mapper.py
#
# Description: This file provides function used to convet addresses to lat and lng cordinates and calculate distance between two points
#
# Author: Jasper Na 

from geopy.geocoders import Nominatim  # Free OpenStreetMap Nominatim
from math import asin, sqrt, cos, pi
from typing import Tuple


class DistanceMapper:
    @staticmethod
    # Haversine formula to compute as-the-crow-flies distances between two points
    # https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    def straight_distance(
        lat_src: float, long_src: float, lat_dest: float, long_dest: float
    ) -> float:
        p = pi / 180
        a = (
            0.5
            - cos((lat_dest - lat_src) * p) / 2
            + cos(lat_src * p)
            * cos(lat_dest * p)
            * (1 - cos((long_dest - long_src) * p))
            / 2
        )
        return 12742 * asin(sqrt(a))

    @staticmethod
    # maps "36 Example St, Randwick, NSW, Australia, 2033" to corresponding geocode coordinates [Longitude, Latitude]
    # Note if street address fails, and try_suburb is true, then suburb will attempt to resolve for a less accurate geocode
    # if address does not resolve then None is returned
    def address_to_geocode(
        street_number: int,
        street: str,
        suburb: str,
        postcode: int,
        try_suburb: bool = True,
    ) -> Tuple[float, float]:
        try:
            locator = Nominatim(user_agent="myspaces")
            # try full address
            geocode_location = locator.geocode(
                query=DistanceMapper.format_nominatim_query_dict(
                    street_number, street, suburb, postcode
                ),
                country_codes="au",
                exactly_one=True,
            )
            # try suburb only
            if geocode_location is None and try_suburb is True:
                print(
                    f"No result for {street_number} {street}, {suburb}, {postcode}. Attempting Suburb."
                )
                return DistanceMapper.suburb_to_geocode(suburb)

            return (
                None if geocode_location is None else geocode_location.latitude,
                geocode_location.longitude,
            )
        except Exception as e:
            print(
                f"[ERR] Unable to convert {street_number} {street}, {suburb}, {postcode} to corresponding GPS coordinates: {e}"
            )
            return None

    @staticmethod
    # Function maps a given suburb to corresponding [Lat,Lng] point
    def suburb_to_geocode(suburb: str) -> Tuple[float, float]:
        if (
            suburb.lower() == "n"
            or suburb.lower() == "s"
            or suburb.lower() == "e"
            or suburb.lower() == "w"
        ):
            return None
        try:
            locator = Nominatim(user_agent="myspaces")
            geocode_location = locator.geocode(
                query=DistanceMapper.format_nominatim_query_dict_suburb(suburb),
                country_codes="au",
                exactly_one=True,
            )
            return (
                None if geocode_location is None else geocode_location.latitude,
                geocode_location.longitude,
            )
        except Exception as e:
            print(
                f"[ERR] Unable to convert {suburb} to corresponding GPS coordinates: {e}"
            )

    @staticmethod
    # creates a dictionary object as expected by Nominatim geocode function for a street address
    # Formatted as per https://nominatim.org/release-docs/develop/api/Search/
    def format_nominatim_query_dict(
        street_number: int, street: str, suburb: str, postcode: int
    ):
        return dict(
            street=f"{street_number} {street}",
            city=suburb,
            state="NSW",
            country="Australia",
            postalCode=str(postcode),
        )

    @staticmethod
    # creates a dictionary object as expected by Nominatim geocode function for a suburb only
    # Formatted as per https://nominatim.org/release-docs/develop/api/Search/
    def format_nominatim_query_dict_suburb(suburb: str):
        return dict(city=suburb, state="NSW", country="Australia")
