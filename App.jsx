import { useState } from "react";
import "./styles.css";
import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { divIcon, point } from "leaflet";

const createTourismIcon = (emoji, color) =>
  divIcon({
    html: `
      <div class="tourism-marker" style="background-color: ${color}">
        ${emoji}
      </div>
    `,
    className: "custom-tourism-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

const userIcon = divIcon({
  html: '<div class="user-marker"><span></span></div>',
  className: "custom-user-icon",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const createClusterCustomIcon = (cluster) =>
  new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true)
  });

// Coordenadas aproximadas; confirme-as antes de publicar.
const touristSpots = [
  {
    id: 1,
    name: "Ponte Estaiada",
    category: "Ponto turístico",
    description:
      "Um dos principais cartões-postais de Teresina, com vista panorâmica da cidade.",
    geocode: [-5.0778, -42.7885],
    emoji: "🌉",
    color: "#2563eb"
  },
  {
    id: 2,
    name: "Parque Encontro dos Rios",
    category: "Natureza",
    description:
      "Local onde os rios Poti e Parnaíba se encontram, com área de lazer e mirante.",
    geocode: [-5.0748, -42.8195],
    emoji: "🌳",
    color: "#16a34a"
  },
  {
    id: 3,
    name: "Parque da Cidadania",
    category: "Lazer",
    description:
      "Espaço de convivência, caminhada, lazer e atividades culturais em Teresina.",
    geocode: [-5.0887, -42.8104],
    emoji: "🏞️",
    color: "#ca8a04"
  },
  {
    id: 4,
    name: "Palácio de Karnak",
    category: "História",
    description:
      "Sede do Governo do Estado do Piauí e importante prédio histórico da cidade.",
    geocode: [-5.0915, -42.8065],
    emoji: "🏛️",
    color: "#9333ea"
  },
  {
    id: 5,
    name: "Museu do Piauí",
    category: "Cultura",
    description: "Museu dedicado à história e à cultura do estado do Piauí.",
    geocode: [-5.0919, -42.8078],
    emoji: "🏺",
    color: "#dc2626"
  }
];

function LocateUserButton({ onLocationFound, onError, loading }) {
  const map = useMap();

  const locateUser = () => {
    if (!navigator.geolocation) {
      onError("Este navegador não oferece suporte à localização.");
      return;
    }

    onLocationFound(null, true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = [
          position.coords.latitude,
          position.coords.longitude
        ];

        map.flyTo(location, 16, { duration: 1.5 });
        onLocationFound(location, false);
      },
      (error) => {
        let message = "Não foi possível obter sua localização.";

        if (error.code === error.PERMISSION_DENIED) {
          message =
            "Permissão negada. Autorize a localização nas configurações do navegador.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "A localização não está disponível no momento.";
        } else if (error.code === error.TIMEOUT) {
          message = "A solicitação de localização demorou demais. Tente novamente.";
        }

        onFoundError(onError, message);
        onLocationFound(null, false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000
      }
    );
  };

  return (
    <button
      className="locate-button"
      onClick={locateUser}
      disabled={loading}
      type="button"
      title="Mostrar minha localização"
    >
      {loading ? "Obtendo localização..." : "📍 Minha localização"}
    </button>
  );
}

function onFoundError(onError, message) {
  onError(message);
}

export default function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  const handleLocationFound = (location, loading) => {
    setUserLocation(location);
    setLoadingLocation(loading);
    if (location) setLocationMessage("Localização encontrada.");
  };

  const handleLocationError = (message) => {
    setLoadingLocation(false);
    setLocationMessage(message);
  };

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[-5.0892, -42.8016]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocateUserButton
          onLocationFound={handleLocationFound}
          onError={handleLocationError}
          loading={loadingLocation}
        />

        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>Você está aqui</Popup>
          </Marker>
        )}

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {touristSpots.map((spot) => (
            <Marker
              key={spot.id}
              position={spot.geocode}
              icon={createTourismIcon(spot.emoji, spot.color)}
            >
              <Popup>
                <div className="tourist-popup">
                  <h3>{spot.name}</h3>
                  <p>
                    <strong>Categoria:</strong> {spot.category}
                  </p>
                  <p>{spot.description}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${spot.geocode[0]},${spot.geocode[1]}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver rota no Google Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {locationMessage && (
        <div className="location-message" role="status">
          {locationMessage}
        </div>
      )}
    </div>
  );
}
