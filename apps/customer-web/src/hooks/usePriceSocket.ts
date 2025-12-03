'use client'

import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface PriceUpdate {
  marketId: string
  symbol: string
  price: number
  change24h: number
  changePercent24h: number
  high24h: number
  low24h: number
  volume24h: number
  timestamp: string
}

interface UsePriceSocketOptions {
  markets?: string[]
  enabled?: boolean
}

export function usePriceSocket(options: UsePriceSocketOptions = {}) {
  const { markets = [], enabled = true } = options
  const [prices, setPrices] = useState<Map<string, PriceUpdate>>(new Map())
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Connect to WebSocket server
    const socket = io('http://localhost:3003/price', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketRef.current = socket

    // Connection event handlers
    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id)
      setIsConnected(true)
      setError(null)

      // Subscribe to markets if provided
      if (markets.length > 0) {
        socket.emit('subscribe', { markets })
      }
    })

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    })

    socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err)
      setError('Failed to connect to price feed')
      setIsConnected(false)
    })

    socket.on('connection', (data) => {
      console.log('Connection confirmed:', data)
    })

    socket.on('subscribed', (data) => {
      console.log('Subscribed to markets:', data.markets)
    })

    socket.on('unsubscribed', (data) => {
      console.log('Unsubscribed from markets:', data.markets)
    })

    // Price update handler
    socket.on('priceUpdate', (data: PriceUpdate) => {
      setPrices((prev) => {
        const updated = new Map(prev)
        updated.set(data.marketId, data)
        return updated
      })
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [enabled])

  // Update subscriptions when markets change
  useEffect(() => {
    if (!socketRef.current || !isConnected || markets.length === 0) return

    socketRef.current.emit('subscribe', { markets })

    return () => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit('unsubscribe', { markets })
      }
    }
  }, [markets.join(','), isConnected])

  const subscribe = (marketIds: string[]) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('subscribe', { markets: marketIds })
    }
  }

  const unsubscribe = (marketIds: string[]) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('unsubscribe', { markets: marketIds })
    }
  }

  return {
    prices,
    isConnected,
    error,
    subscribe,
    unsubscribe,
  }
}
