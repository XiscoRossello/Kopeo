'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix per les icones de Leaflet en Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface LocationMapProps {
  latitude: number
  longitude: number
  onLocationChange?: (lat: number, lng: number) => void
  height?: string
  draggable?: boolean
}

export default function LocationMap({
  latitude,
  longitude,
  onLocationChange,
  height = '200px',
  draggable = true
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Inicialitzar mapa si no existeix
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [latitude, longitude],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: true,
      })

      // Afegir capa de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapInstanceRef.current)

      // Crear marcador
      markerRef.current = L.marker([latitude, longitude], {
        icon,
        draggable
      }).addTo(mapInstanceRef.current)

      // Event quan es mou el marcador
      if (draggable && onLocationChange) {
        markerRef.current.on('dragend', () => {
          const pos = markerRef.current?.getLatLng()
          if (pos) {
            onLocationChange(pos.lat, pos.lng)
          }
        })
      }
    } else {
      // Actualitzar posició si ja existeix
      mapInstanceRef.current.setView([latitude, longitude], 15)
      markerRef.current?.setLatLng([latitude, longitude])
    }

    // Cleanup
    return () => {
      // No destruir el mapa aquí per evitar problemes amb re-renders
    }
  }, [latitude, longitude, draggable, onLocationChange])

  // Cleanup quan el component es desmunta
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [])

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%' }}
      className="rounded-xl"
    />
  )
}
