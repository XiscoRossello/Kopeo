'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Loader2, X } from 'lucide-react'
import dynamic from 'next/dynamic'

// Importar mapa de forma dinàmica per evitar SSR
const MapComponent = dynamic<{
  latitude: number
  longitude: number
  onLocationChange?: (lat: number, lng: number) => void
}>(() => import('@/components/LocationMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-surface-light rounded-xl flex items-center justify-center">
      <Loader2 className="animate-spin text-gray-500" size={24} />
    </div>
  )
})

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  address: {
    road?: string
    house_number?: string
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
  }
}

interface AddressAutocompleteProps {
  value: string
  latitude: number | null
  longitude: number | null
  onChange: (address: string, lat: number | null, lng: number | null) => void
  placeholder?: string
}

export default function AddressAutocomplete({
  value,
  latitude,
  longitude,
  onChange,
  placeholder = 'Cerca una adreça...'
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<NominatimResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Sincronitzar query amb value extern
  useEffect(() => {
    setQuery(value)
  }, [value])

  // Cercar adreces amb debounce
  const searchAddresses = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` + 
        new URLSearchParams({
          q: searchQuery,
          format: 'json',
          addressdetails: '1',
          limit: '5',
          countrycodes: 'es', // Limitar a Espanya per defecte
        }),
        {
          headers: {
            'Accept-Language': 'ca,es',
          }
        }
      )
      
      if (response.ok) {
        const data: NominatimResult[] = await response.json()
        setResults(data)
        setShowResults(data.length > 0)
        setSelectedIndex(-1)
      }
    } catch (error) {
      console.error('Error cercant adreces:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Gestionar canvis en l'input amb debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    
    // Debounce de 300ms per evitar massa peticions
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      searchAddresses(newQuery)
    }, 300)
  }

  // Seleccionar una adreça
  const handleSelectAddress = (result: NominatimResult) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    
    setQuery(result.display_name)
    setShowResults(false)
    setResults([])
    
    onChange(result.display_name, lat, lng)
  }

  // Navegació amb teclat
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelectAddress(results[selectedIndex])
        }
        break
      case 'Escape':
        setShowResults(false)
        break
    }
  }

  // Tancar resultats quan es fa clic fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(e.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(e.target as Node)
      ) {
        setShowResults(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Netejar adreça
  const handleClear = () => {
    setQuery('')
    setResults([])
    onChange('', null, null)
    inputRef.current?.focus()
  }

  return (
    <div className="space-y-3">
      {/* Input amb autocompletat */}
      <div className="relative">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setShowResults(true)}
            className="w-full pl-10 pr-10 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            placeholder={placeholder}
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 animate-spin" size={18} />
          )}
          {!loading && query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Resultats del cerca */}
        {showResults && results.length > 0 && (
          <div
            ref={resultsRef}
            className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-xl shadow-lg overflow-hidden"
          >
            {results.map((result, index) => (
              <button
                key={result.place_id}
                type="button"
                onClick={() => handleSelectAddress(result)}
                className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-start gap-3 ${
                  index === selectedIndex 
                    ? 'bg-primary/20 text-primary-light' 
                    : 'hover:bg-surface-light'
                }`}
              >
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />
                <span className="line-clamp-2">{result.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mapa */}
      {latitude && longitude && (
        <div className="rounded-xl overflow-hidden border border-border">
          <MapComponent 
            latitude={latitude} 
            longitude={longitude}
            onLocationChange={(lat: number, lng: number) => {
              // Opcional: Permet moure el marcador
              onChange(query, lat, lng)
            }}
          />
        </div>
      )}

      {/* Coordenades (mostrar però no editable directament) */}
      {latitude && longitude && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>📍 {latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
        </div>
      )}
    </div>
  )
}
