'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { ScanLine, Check, X, Wine, Loader2, Camera } from 'lucide-react'
import type { WalletItem } from '@/lib/types'
import Image from 'next/image'

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false)
  const [scannedUserId, setScannedUserId] = useState<string | null>(null)
  const [walletItems, setWalletItems] = useState<WalletItem[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [userInfo, setUserInfo] = useState<{ email: string; full_name: string } | null>(null)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const supabase = createClient()

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error)
      }
    }
  }, [])

  const startScanning = () => {
    setScanning(true)
    setScannedUserId(null)
    setWalletItems([])
    setSelectedItems(new Set())
    setMessage(null)

    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      )

      scanner.render(
        async (decodedText) => {
          scanner.clear().catch(console.error)
          setScanning(false)
          await handleScan(decodedText)
        },
        (error) => {
          // console.log(error)
        }
      )

      scannerRef.current = scanner
    }, 100)
  }

  const handleScan = async (userId: string) => {
    setLoading(true)

    // Get user info
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    if (profile) {
      setUserInfo(profile)
    }

    // Get wallet items for this user that belong to events from current commerce
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: commerce } = await supabase
      .from('commerces')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!commerce) {
      setMessage({ type: 'error', text: 'No tienes un comercio asociado' })
      setLoading(false)
      return
    }

    const { data: items, error } = await supabase
      .from('wallet_items')
      .select('*, product:products(*), event:events!inner(*)')
      .eq('user_id', userId)
      .eq('status', 'available')
      .eq('event.commerce_id', commerce.id)

    if (error) {
      setMessage({ type: 'error', text: 'Error al cargar las bebidas' })
      setLoading(false)
      return
    }

    setScannedUserId(userId)
    setWalletItems(items as WalletItem[])
    setLoading(false)

    if (items.length === 0) {
      setMessage({ type: 'error', text: 'Este usuario no tiene bebidas disponibles en tu local' })
    }
  }

  const toggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const selectAll = () => {
    if (selectedItems.size === walletItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(walletItems.map(i => i.id)))
    }
  }

  const redeemSelected = async () => {
    if (selectedItems.size === 0) return

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('wallet_items')
      .update({
        status: 'redeemed',
        redeemed_at: new Date().toISOString(),
        redeemed_by: user?.id,
      })
      .in('id', Array.from(selectedItems))

    if (error) {
      setMessage({ type: 'error', text: 'Error al canjear las bebidas' })
    } else {
      setMessage({ type: 'success', text: `${selectedItems.size} bebidas canjeadas correctamente` })
      // Remove redeemed items from list
      setWalletItems(prev => prev.filter(i => !selectedItems.has(i.id)))
      setSelectedItems(new Set())
    }

    setLoading(false)
  }

  const reset = () => {
    setScannedUserId(null)
    setWalletItems([])
    setSelectedItems(new Set())
    setMessage(null)
    setUserInfo(null)
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center">
            <ScanLine size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Escáner QR</h1>
          <p className="text-gray-500">Escanea el código QR del cliente para canjear sus bebidas</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {message.type === 'success' ? <Check size={20} /> : <X size={20} />}
            {message.text}
          </div>
        )}

        {/* Scanner */}
        {!scannedUserId && !scanning && (
          <button
            onClick={startScanning}
            className="w-full gradient-accent py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
          >
            <Camera size={24} />
            Iniciar escaneo
          </button>
        )}

        {scanning && (
          <div className="bg-surface rounded-2xl border border-border p-4 space-y-4">
            <div id="qr-reader" className="rounded-xl overflow-hidden" />
            <button
              onClick={() => {
                if (scannerRef.current) {
                  scannerRef.current.clear().catch(console.error)
                }
                setScanning(false)
              }}
              className="w-full py-3 rounded-xl border border-border text-gray-400 hover:bg-surface-light transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        )}

        {/* Scanned user info */}
        {scannedUserId && userInfo && !loading && (
          <div className="bg-surface rounded-2xl border border-border p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-xl font-bold text-white">
                {userInfo.full_name?.charAt(0) || userInfo.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{userInfo.full_name || 'Usuario'}</p>
                <p className="text-sm text-gray-500">{userInfo.email}</p>
              </div>
            </div>

            {walletItems.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Wine size={18} className="text-accent" />
                    Bebidas disponibles ({walletItems.length})
                  </h3>
                  <button
                    onClick={selectAll}
                    className="text-sm text-primary-light hover:underline"
                  >
                    {selectedItems.size === walletItems.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
                  </button>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {walletItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        selectedItems.has(item.id)
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-gray-500'
                      }`}
                    >
                      {item.product?.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-lg">
                          🍹
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-xs text-gray-500">{item.event?.title}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedItems.has(item.id)
                          ? 'border-accent bg-accent'
                          : 'border-gray-500'
                      }`}>
                        {selectedItems.has(item.id) && <Check size={14} className="text-white" />}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={redeemSelected}
                  disabled={selectedItems.size === 0 || loading}
                  className="w-full gradient-accent py-3 rounded-xl font-semibold text-white disabled:opacity-50 transition-opacity"
                >
                  Canjear {selectedItems.size} bebida{selectedItems.size !== 1 ? 's' : ''}
                </button>
              </>
            )}

            <button
              onClick={reset}
              className="w-full py-3 rounded-xl border border-border text-gray-400 hover:bg-surface-light transition-colors"
            >
              Escanear otro QR
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
