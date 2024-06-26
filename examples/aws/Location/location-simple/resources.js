// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "GeofenceCollection",
    group: "Location",
    properties: ({}) => ({
      CollectionName: "explore.geofence-collection",
      Description: "Created by Amazon Location Service explore",
      PricingPlan: "RequestBasedUsage",
    }),
  },
  {
    type: "Map",
    group: "Location",
    properties: ({}) => ({
      Configuration: {
        Style: "VectorEsriTopographic",
      },
      DataSource: "Esri",
      Description: "Created by Amazon Location Service explore",
      MapName: "explore.map",
    }),
  },
  {
    type: "Map",
    group: "Location",
    properties: ({}) => ({
      Configuration: {
        Style: "VectorEsriTopographic",
      },
      DataSource: "Esri",
      MapName: "my-map",
    }),
  },
  {
    type: "PlaceIndex",
    group: "Location",
    properties: ({}) => ({
      DataSource: "Esri",
      DataSourceConfiguration: {
        IntendedUse: "SingleUse",
      },
      Description: "Created by Amazon Location Service explore",
      IndexName: "explore.place",
      PricingPlan: "RequestBasedUsage",
    }),
  },
  {
    type: "RouteCalculator",
    group: "Location",
    properties: ({}) => ({
      CalculatorName: "explore.route-calculator",
      DataSource: "Esri",
      Description: "Created by Amazon Location Service explore",
      PricingPlan: "RequestBasedUsage",
    }),
  },
  {
    type: "Tracker",
    group: "Location",
    properties: ({}) => ({
      Description: "Created by Amazon Location Service explore",
      PositionFiltering: "TimeBased",
      PricingPlan: "RequestBasedUsage",
      TrackerName: "explore.tracker",
    }),
  },
];
