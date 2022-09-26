/** 
 * @description A file to store visual things like polyline parameters and icon urls
 * @author E.Omer Gul
 */


/**
 * @description visual options for polyline based on what transit it is for
 */
 export const transit_options = {
    BUS: 
     {
      strokeColor: '#65DFF6',
      strokeOpacity: 1,
      strokeWeight: 4,
      fillColor: '#65DFF6',
      fillOpacity: 0,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: 30000,
      paths: null,
      zIndex: 1
    },
    TRAM:  {
      strokeColor: '#D01110',
      strokeOpacity: 1,
      strokeWeight: 4,
      fillColor: '#D01110',
      fillOpacity: 1,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: 30000,
      paths: null,
      zIndex: 1
    },
    WALKING:  {
      strokeColor: '#140005',
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: '#140005',
      fillOpacity: 1,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: 30000,
      paths: null,
      zIndex: 1
    },
    HEAVY_RAIL:  {
      strokeColor: '#FF8300',
      strokeOpacity: 1,
      strokeWeight: 4,
      fillColor: '#FF8300',
      fillOpacity: 1,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: 30000,
      paths: null,
      zIndex: 1
    },
    FERRY:  {
      strokeColor: '#3D550C',
      strokeOpacity: 1,
      strokeWeight: 4,
      fillColor: '#3D550C',
      fillOpacity: 1,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: 30000,
      paths: null,
      zIndex: 1
    },
  }
  
  
  
  export const transit_outline_options = {
    BUS: 
     {
      strokeColor: '#189AB4',
      strokeOpacity: 1,
      strokeWeight: 7,
      fillColor: '#189AB4',
      fillOpacity: 0,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: 30000,
      paths: null,
      zIndex: 1
    },
    TRAM:  {
      strokeColor: '#400100',
      strokeOpacity: 1,
      strokeWeight: 7,
      fillColor: '#400100',
      fillOpacity: 1,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: 30000,
      paths: null,
      zIndex: 1
    },
    WALKING:  {
      strokeColor: '#020000',
      strokeOpacity: 0.1,
      strokeWeight: 5,
      fillColor: '#020000',
      fillOpacity: 1,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: 30000,
      paths: null,
      zIndex: 1
    },
    HEAVY_RAIL:  {
      strokeColor: '#be7c00',
      strokeOpacity: 1,
      strokeWeight: 7,
      fillColor: '#be7c00',
      fillOpacity: 1,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: 30000,
      paths: null,
      zIndex: 1
    },
    FERRY:  {
      strokeColor: '#074700',
      strokeOpacity: 1,
      strokeWeight: 7,
      fillColor: '#074700',
      fillOpacity: 1,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: 30000,
      paths: null,
      zIndex: 1
    },
  }
  
  
  /**
   * @description matches the transit methods with the Icons
   */
  export const icons_urls = { 
    BUS:        "//maps.gstatic.com/mapfiles/transit/iw2/6/au-sydney-bus.png",
    TRAM:       "//maps.gstatic.com/mapfiles/transit/iw2/6/au-sydney-tram.png",
    WALKING:    "//maps.gstatic.com/mapfiles/transit/iw2/6/walk.png",
    HEAVY_RAIL: "//maps.gstatic.com/mapfiles/transit/iw2/6/au-sydney-train.png",
    FERRY:      "//maps.gstatic.com/mapfiles/transit/iw2/6/au-sydney-ferry.png",
    CAR:        "//maps.gstatic.com/consumer/images/icons/2x/directions_car_grey800_24dp.png"
  }