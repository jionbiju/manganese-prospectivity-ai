import { useMemo } from "react";
import Map, { Source, Layer, NavigationControl, ScaleControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { STUDY_AREA } from "../../config";

interface Props {
  prospectivity: any;
  occurrences: any;
  faults: any;
  leases: any;
  drillTargets: any;
  basemap: string;
  activeModel: string;
  opacity: number;
  threshold: number;
  visibleLayers: Record<string, boolean>;
  continuousColors: boolean;
  colorblindSafe: boolean;
  onCellClick: (id: string) => void;
}

export default function MapView({
  prospectivity, occurrences, faults, leases, drillTargets,
  basemap, activeModel, opacity, threshold, visibleLayers,
  continuousColors, colorblindSafe, onCellClick
}: Props) {
  
  const mapStyle = useMemo(() => {
    if (basemap === "satellite") {
      return {
        version: 8,
        sources: {
          "esri-satellite": {
            type: "raster",
            tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
            tileSize: 256,
            attribution: "Esri"
          }
        },
        layers: [{ id: "satellite", type: "raster", source: "esri-satellite", minzoom: 0, maxzoom: 22 }]
      };
    }
    if (basemap === "terrain") {
      return {
        version: 8,
        sources: {
          "osm-terrain": {
            type: "raster",
            tiles: ["https://tile.opentopomap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)"
          }
        },
        layers: [{ id: "terrain", type: "raster", source: "osm-terrain", minzoom: 0, maxzoom: 17 }]
      };
    }
    // Default OSM
    return {
      version: 8,
      sources: {
        "osm": {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors"
        }
      },
      layers: [{ id: "osm", type: "raster", source: "osm", minzoom: 0, maxzoom: 19 }]
    };
  }, [basemap]);

  // Mapbox style expressions for prospectivity colors
  const fillColorExpression = useMemo(() => {
    // Colors
    const low = colorblindSafe ? "#fde0dd" : "#fee2e2";
    const medium = colorblindSafe ? "#fa9fb5" : "#fef08a";
    const high = colorblindSafe ? "#c51b8a" : "#22c55e";

    if (continuousColors) {
      return [
        "interpolate",
        ["linear"],
        ["get", activeModel],
        0, low,
        0.5, medium,
        1.0, high
      ];
    } else {
      return [
        "step",
        ["get", activeModel],
        low,
        0.33, medium,
        0.66, high
      ];
    }
  }, [activeModel, continuousColors, colorblindSafe]);

  const filterExpression = useMemo(() => {
    return [">=", ["get", activeModel], threshold];
  }, [activeModel, threshold]);

  const handleMapClick = (e: any) => {
    const feature = e.features && e.features[0];
    if (feature && feature.layer.id === "prospectivity-fill") {
      onCellClick(feature.properties.id);
    } else {
      onCellClick(null as any);
    }
  };

  return (
    <Map
      initialViewState={{
        longitude: STUDY_AREA.center.lng,
        latitude: STUDY_AREA.center.lat,
        zoom: 11
      }}
      maplibreLogo={false}
      mapStyle={mapStyle as any}
      interactiveLayerIds={visibleLayers.prospectivity ? ["prospectivity-fill"] : []}
      onClick={handleMapClick}
      cursor={visibleLayers.prospectivity ? "pointer" : "grab"}
    >
      <NavigationControl position="top-left" />
      <ScaleControl position="bottom-left" />

      {/* Prospectivity Grid */}
      {visibleLayers.prospectivity && prospectivity && (
        <Source id="prospectivity" type="geojson" data={prospectivity}>
          <Layer
            id="prospectivity-fill"
            type="fill"
            filter={filterExpression as any}
            paint={{
              "fill-color": fillColorExpression as any,
              "fill-opacity": opacity,
              "fill-outline-color": "rgba(0,0,0,0.1)"
            }}
          />
        </Source>
      )}

      {/* Faults */}
      {visibleLayers.faults && faults && (
        <Source id="faults" type="geojson" data={faults}>
          <Layer
            id="faults-line"
            type="line"
            paint={{
              "line-color": "#ef4444",
              "line-width": 2,
              "line-dasharray": [2, 2]
            }}
          />
        </Source>
      )}

      {/* Occurrences */}
      {visibleLayers.occurrences && occurrences && (
        <Source id="occurrences" type="geojson" data={occurrences}>
          <Layer
            id="occurrences-point"
            type="circle"
            paint={{
              "circle-color": "#3b82f6",
              "circle-radius": 6,
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff"
            }}
          />
        </Source>
      )}

      {/* Leases */}
      {visibleLayers.leases && leases && (
        <Source id="leases" type="geojson" data={leases}>
          <Layer
            id="leases-point"
            type="circle"
            paint={{
              "circle-color": "#8b5cf6",
              "circle-radius": 8,
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff"
            }}
          />
        </Source>
      )}

      {/* Drill Targets */}
      {visibleLayers.drillTargets && drillTargets && (
        <Source
          id="drill-targets"
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: drillTargets.map((t: any) => ({
              type: "Feature",
              geometry: { type: "Point", coordinates: [t.lng, t.lat] },
              properties: { rank: t.rank, score: t.score }
            }))
          } as any}
        >
          <Layer
            id="drill-targets-point"
            type="circle"
            paint={{
              "circle-color": "#f59e0b",
              "circle-radius": 10,
              "circle-stroke-width": 3,
              "circle-stroke-color": "#ffffff"
            }}
          />
          <Layer
            id="drill-targets-text"
            type="symbol"
            layout={{
              "text-field": ["get", "rank"],
              "text-size": 12,
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"]
            }}
            paint={{
              "text-color": "#ffffff"
            }}
          />
        </Source>
      )}
    </Map>
  );
}
