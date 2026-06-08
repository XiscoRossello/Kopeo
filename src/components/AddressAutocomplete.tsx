'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Loader2, ChevronDown, X } from 'lucide-react'

interface Suggestion {
  display_name: string
  lat: string
  lon: string
}

interface AddressAutocompleteProps {
  value: string
  onChange: (address: string, lat: string, lon: string) => void
  placeholder?: string
}

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = 'Buscar dirección...',
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSuggestions = useCallback(async (text: string) => {
    if (!text || text.length < 3) {
      setSuggestions([])
      setOpen(false)
      return
    }
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=5&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'es',
          },
          signal: abortRef.current.signal,
        }
      )
      const data = (await res.json()) as Suggestion[]
      setSuggestions(data)
      setHighlightedIndex(-1)
      setOpen(data.length > 0)
    } catch {
      setSuggestions([])
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    onChange(val, '', '')
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => fetchSuggestions(val), 400)
  }

  const handleSelect = (s: Suggestion) => {
    setQuery(s.display_name)
    onChange(s.display_name, s.lat, s.lon)
    setOpen(false)
    setSuggestions([])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => {
        const next = prev + 1
        return next >= suggestions.length ? 0 : next
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => {
        const next = prev - 1
        return next < 0 ? suggestions.length - 1 : next
      })
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelect(suggestions[highlightedIndex])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const handleClear = () => {
    setQuery('')
    onChange('', '', '')
    setSuggestions([])
    setOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true)
          }}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          placeholder={placeholder}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        )}
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 animate-spin" size={18} />
        ) : (
          <ChevronDown
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
            size={18}
          />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-surface border border-border rounded-xl shadow-lg overflow-hidden max-h-72 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button
              key={`${s.lat}-${s.lon}-${i}`}
              type="button"
              onClick={() => handleSelect(s)}
              onMouseEnter={() => setHighlightedIndex(i)}
              className={`w-full text-left px-4 py-3 transition-colors flex items-start gap-2 border-b border-border last:border-0 ${
                i === highlightedIndex ? 'bg-primary/10' : 'hover:bg-surface-light'
              }`}
            >
              <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{s.display_name}</span>
            </button>
          ))}
        </div>
      )}

      {open && !loading && suggestions.length === 0 && query.length >= 3 && (
        <div className="absolute z-50 mt-1 w-full bg-surface border border-border rounded-xl shadow-lg px-4 py-3 text-sm text-gray-500">
          No se encontraron resultados
        </div>
      )}
    </div>
  )
}
