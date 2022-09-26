# Version: python:3.8
#
# Name: db_populator.py
#
# Description: Script has been created to generate real listing data. Random Addresses are trialed and if Latitde/Longitide resolve, then the listing is considered valid
#
# Author: Jasper Na


import sys

sys.path.append("../")
sys.path.append("../../")

List_of_Streets = [
    "George St",
    "William St",
    "Church St",
    "High St",
    "King St",
    "Short St",
    "Elizabeth St",
    "John St",
    "Victoria St",
    "Queen St",
    "Common Lane",
    "Hillside Close",
    "Teal Close",
    "Windsor Avenue",
    "Mount Pleasant Road",
    "Albion Road",
    "London Road",
    "Shelley Road",
    "Laburnum Road",
    "Wells Close",
    "St Peters Close",
    "Oak Grove",
    "Park Crescent",
    "Wordsworth Road",
    "Victoria Close",
    "Derwent Road",
    "Mansfield Road",
    "Belvedere Road",
    "Mount Pleasant",
    "Barton Close",
    "Bedford Road",
    "Manor St",
    "Oakwood Road",
    "Rose Hill",
    "Chester St",
    "Stanley Close",
    "Wood St",
    "Sherwood Close",
    "Frederick St",
    "Grosvenor Road",
    "The Glen",
    "Chichester Close",
    "Laburnum Avenue",
    "Brookfield Road",
    "Priory Road",
    "Orchard Road",
    "Station Lane",
    "Coppice Close",
    "Cedar Close",
    "Holland Road",
    "Newton Close",
    "Newlands Road",
    "Hastings Road",
    "Westfield Avenue",
    "Prospect Road",
    "West View",
    "South Close",
    "Martin Close",
    "Ferry Lane",
    "Churchill Close",
    "Edward St",
    "Warwick St",
    "Trinity St",
    "The Close",
    "Newton St",
    "East Avenue",
    "Woodstock Road",
    "The Cloisters",
    "Hillside Road",
    "Avon Close",
    "Weston Road",
    "Grange Avenue",
    "Douglas Road",
    "Bracken Close",
    "Main St",
    "Manor Court",
    "Castle Hill",
    "Derby St",
    "Moor Lane",
    "South View",
    "Kestrel Close",
    "Laburnum Close",
    "Beverley Road",
    "Woodland Avenue",
    "Ash Close",
    "Queens Drive",
    "Oak Road",
    "Poplar Avenue",
    "Castle Drive",
    "Meadow St",
    "Kensington Road",
    "Richmond Road",
    "Kingsley Road",
    "St Michael's Close",
    "Beechwood Avenue",
    "Eastfield Road",
    "Orchard Gardens",
    "Orchard Avenue",
    "Clifton St",
    "West Drive",
    "Green Lane",
    "Bishops Close",
    "Hazel Close",
    "Coniston Close",
    "Mill Lane",
    "Mayfield Avenue",
    "College St",
    "York St",
    "The Chase",
    "Wentworth Road",
]
list_of_suburb_and_postcodes = {
    "Kingsford": 2022,
    "Glebe": 2037,
    "Annandale": 2038,
    "Rozelle": 2039,
    "Leichhardt": 2040,
    "Haymarket": 2000,
    "Barangaroo": 2000,
    "Broadway": 2007,
    "Ultimo": 2007,
    "Surry Hills": 2010,
    "Kings Cross": 2011,
    "Rushcutters Bay": 2011,
    "Woolloomooloo": 2011,
    "Strawberry Hills": 2012,
    "Alexandria": 2015,
    "Beaconsfield": 2015,
    "Waterloo": 2017,
    "Rosebery": 2018,
    "Banksmeadow": 2019,
    "Botany": 2019,
    "Mascot": 2020,
    "Sydney Domestic Airport": 2020,
    "Sydney International Airport": 2020,
    "Paddington": 2021,
    "Bondi Junction": 2022,
    "Queens Park": 2022,
    "Bronte": 2024,
    "Waverley": 2024,
    "Dover Heights": 2030,
    "Hmas Watson": 2030,
    "Rose Bay North": 2030,
    "Vaucluse": 2030,
    "Watsons Bay": 2030,
    "Clovelly": 2031,
    "Randwick": 2031,
    "St Pauls": 2031,
    "Daceyville": 2032,
    "Kingsford": 2032,
    "Coogee": 2034,
    "South Coogee": 2034,
    "Maroubra": 2035,
    "Pagewood": 2035,
    "Eastgardens": 2036,
    "Hillsdale": 2036,
    "La Perouse": 2036,
    "Little Bay": 2036,
}

from search.distance_mapper import DistanceMapper
import random
from random import randint, uniform

# Number of times to run the generation
NUM_PASSES = 2
# Number of different addresses to try for a given suburb before moving on
ATTEMPTS = 30
file = open("populateV2.sql", "w")

addresses = []

for PASS in range(1, NUM_PASSES):
    for street in List_of_Streets:
        street_num = randint(1, 100)
        suburbs = list(list_of_suburb_and_postcodes.items())
        for ATTEMPT in range(1, ATTEMPTS):
            itm = random.choice(suburbs)
            suburb_name, postcode = itm
            ret = DistanceMapper.address_to_geocode(
                street_num, street, suburb_name, postcode, False
            )
            suburbs.remove(itm)

            if ret == None:
                continue

            [longitude, latitude] = ret
            addr_key = f"{street_num}{street}{suburb_name}{postcode}"
            insert_cmd = f"INSERT INTO Listings VALUES (DEFAULT, {randint(1,6)}, {randint(1,15)}, '', {street_num}, '{street}', '{suburb_name}', {postcode}, {round(uniform(1.5,2.5),2)}, {round(uniform(1.5,2.5),2)}, {round(uniform(1.5,2.5),2)}, {longitude}, {latitude});\n"
            if addr_key not in addresses:
                addresses.append(addr_key)
                file.write(insert_cmd)
            break

file.close()
