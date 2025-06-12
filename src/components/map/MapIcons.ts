import L from "leaflet";

/**
 * Custom map icons for different stop types
 * Includes selected state with larger, gold icon
 */
export class MapIcons {
  static readonly startIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  static readonly stopIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  static readonly endIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  static readonly selectedIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [35, 55],
    iconAnchor: [17, 55],
    popupAnchor: [1, -44],
    shadowSize: [41, 41],
  });

  /**
   * Get appropriate icon based on stop type and selection state
   */
  static getIcon(
    stop: { id: string; type: "start" | "stop" | "end" },
    selectedStopId?: string
  ): L.Icon {
    if (selectedStopId === stop.id) {
      return this.selectedIcon;
    }

    switch (stop.type) {
      case "start":
        return this.startIcon;
      case "end":
        return this.endIcon;
      default:
        return this.stopIcon;
    }
  }
}
