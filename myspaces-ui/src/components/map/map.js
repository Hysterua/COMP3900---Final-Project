/**
 * Google Map component file
 * 
 * @author E.Omer Gul
 */


import React, { useEffect } from "react";
import {decode, encode} from "@googlemaps/polyline-codec"
import {
    GoogleMap,
    useLoadScript,
    Marker,
    Polyline,
} from "@react-google-maps/api"
import { transit_options, transit_outline_options, icons_urls } from "./visual_options";

const mapContainerStyle = {
    width: "40vw",
    height: "50vh",

}

const sydney_center = {
   lat: -33.8688,
   lng:151.2093,
}

export function Map({lat, lng, polylineString, transitMethod}) {

  const [markers, setMarkers] = React.useState([]);
  const [startMarkers, setStartMarkers] = React.useState([]);
  const [middleMarkers, setMiddleMarkers] = React.useState([]);
  const [endMarkers, setEndMarkers] = React.useState([]);
  const [polylines, setPolylines] = React.useState([]);

  // To use this add a google maps api key
  const {isLoaded,loadError} = useLoadScript({
      googleMapsApiKey: "" 
  });

  if (loadError) return `Error loading maps ${loadError}`;
  if (!isLoaded) return "Loading Maps";

  var encoded_array = []
  if (polylineString) { // NULL CHECK
    encoded_array = polylineString.split("!") // The poly line comes is in such a way that each leg of travel is separated by a ! char
  }

  var transit_array = []
  if (polylineString) { // NULL CHECK
    transit_array = transitMethod.split("|") // The poly line comes is in such a way that each leg of travel is separated by a ! char
  }

  var decoded_objects = []; // this is an object of the form
  var decoded_objects_array = []; // this is an array of objects of the form 

  encoded_array.forEach(function(string) { // iterating through each leg of travel
       decoded_objects = [];
       const decoded = decode(string, 5) // takes in encoded string and spits out an array of objects of the form bellow
       decoded.forEach(function(pair) { 
           var temp = {
               lat: pair[0],
               lng: pair[1]
           }
           decoded_objects.push(temp)
       })
       decoded_objects_array.push(decoded_objects)
  })

  var temp
  const start_points = []
  const middle_points = []
  const end_points = []
  const list_of_polylines = [] // We populate this for the polyline component below to call
  decoded_objects_array.forEach(function(decoded_object,index) { // we loop through the dataobjcets that we have to get start point mid points and total polylines
      var tempobj = {
          key: index,
          path: decoded_object
      }

    temp = decoded_object[0]
    start_points.push(temp) 

    temp = decoded_object[Math.floor(decoded_object.length/2)]
    middle_points.push(temp)

    temp = decoded_object[decoded_object.length - 1]
    end_points.push(temp)

    list_of_polylines.push(tempobj)

  })

  const last_obect = decoded_objects_array[decoded_objects_array.length -1]
  var last_point
  if (last_obect) {
      last_point = last_obect[last_obect.length -1]
  }

  if (start_points.length === 0) {
    start_points.push({lat: lat,lng: lng})
  }

  return (




    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={14} center={start_points[0]} options={{ gestureHandling: 'none'}} onTilesLoaded={() => {
        setMarkers({key:100, position: start_points[0]});
      
        setPolylines(list_of_polylines)
        setStartMarkers(start_points)
        setMiddleMarkers(middle_points)
        // setEndMarkers(end_points)
      }}> 

        {polylines.map((decoded_object, index) => ( // prints polyline  and polyline outline (for visuals)
          <div>
            <Polyline key={polylines[index].key+200} path={polylines[index].path} options={transit_outline_options[transit_array[index]]}/>
            <Polyline key={polylines[index].key+100} path={polylines[index].path} options={transit_options[transit_array[index]]}/>
          </div>
        ))}
        
        <Marker key={markers.key} position={markers.position}/>

        {startMarkers.map((bruh,index) => ( // printing white dot at the start of each polyline
          <Marker key={index+50} position={startMarkers[index+1]} icon={"http://labs.google.com/ridefinder/images/mm_20_white.png" }/> 
        ))}

        {middleMarkers.map((bruh,index) => ( // printing transit icons in middle of polyline
          <Marker key={index+50} position={middleMarkers[index]} icon={icons_urls[transit_array[index]]}/> 
        ))}

        <Marker key={markers.key + 1 } position={last_point}/> 

    </GoogleMap>

   )
}



