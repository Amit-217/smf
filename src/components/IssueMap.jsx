import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

export const PRIORITY_COLORS = { high: '#c62828', medium: '#ef6c00', watch: '#2e7d32' };

export default function IssueMap({ issues }) {
  const navigate = useNavigate();
  return (
    <MapContainer center={[19.2, 76.2]} zoom={6} scrollWheelZoom={false} className="issue-map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {issues
        .filter((i) => i.location?.lat && i.location?.lng)
        .map((i) => (
          <CircleMarker
            key={i._id}
            center={[i.location.lat, i.location.lng]}
            radius={10}
            pathOptions={{ color: '#fff', weight: 2, fillColor: PRIORITY_COLORS[i.priority] || '#555', fillOpacity: 0.9 }}
            eventHandlers={{ click: () => navigate(`/issues/${i.slug}`) }}
          >
            <Tooltip>
              <strong>{i.title}</strong>
              <br />
              {i.district} · {i.status}
            </Tooltip>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}
