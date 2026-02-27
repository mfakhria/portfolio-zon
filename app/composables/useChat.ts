import * as Ably from 'ably'

export interface GuestMessage {
  id: number
  name: string
  content: string
  isAdmin: boolean
  replyToId: number | null
  createdAt: string
  replies?: GuestMessage[]
}

export function useChat() {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string
  const ablyKey = config.public.ablyKey as string

  const messages = ref<GuestMessage[]>([])
  const connected = ref(false)
  const error = ref('')

  let ably: Ably.Realtime | null = null
  let channel: Ably.RealtimeChannel | null = null

  async function fetchMessages(cursor?: number) {
    const query = cursor ? `?cursor=${cursor}` : ''
    const data = await $fetch<GuestMessage[]>(`${apiBase}/chat${query}`)
    return data
  }

  async function connect() {
    if (connected.value) return

    // Load initial messages via REST
    try {
      const data = await fetchMessages()
      messages.value = data.reverse()
    } catch (e) {
      console.error('Failed to load messages:', e)
    }

    // Subscribe to real-time updates via Ably
    if (!ablyKey) {
      console.warn('Ably key not set — real-time disabled')
      connected.value = true
      return
    }

    try {
      ably = new Ably.Realtime({ key: ablyKey })
      channel = ably.channels.get('guestbook')

      channel!.subscribe('new_message', (msg) => {
        const data = msg.data as GuestMessage
        // If it's a reply, attach to parent
        if (data.replyToId) {
          const parent = messages.value.find((m) => m.id === data.replyToId)
          if (parent) {
            if (!parent.replies) parent.replies = []
            // Avoid duplicates
            if (!parent.replies.some((r) => r.id === data.id)) {
              parent.replies.push(data)
            }
            return
          }
        }
        // Avoid duplicates
        if (!messages.value.some((m) => m.id === data.id)) {
          messages.value.push(data)
        }
      })

      channel!.subscribe('message_deleted', (msg) => {
        const { id } = msg.data as { id: number }
        // Remove from top-level
        messages.value = messages.value.filter((m) => m.id !== id)
        // Remove from replies
        for (const m of messages.value) {
          if (m.replies) {
            m.replies = m.replies.filter((r) => r.id !== id)
          }
        }
      })

      ably.connection.on('connected', () => {
        connected.value = true
        error.value = ''
      })

      ably.connection.on('disconnected', () => {
        connected.value = false
      })

      ably.connection.on('failed', () => {
        connected.value = false
        error.value = 'Connection failed'
      })

      // Wait for connection
      await ably.connection.once('connected')
      connected.value = true
    } catch (e) {
      console.error('Ably connection error:', e)
      connected.value = true // still show messages from REST
    }
  }

  function disconnect() {
    channel?.unsubscribe()
    ably?.close()
    ably = null
    channel = null
    connected.value = false
  }

  async function sendMessage(name: string, content: string, replyToId?: number) {
    error.value = ''
    try {
      await $fetch(`${apiBase}/chat`, {
        method: 'POST',
        body: { name, content, replyToId },
      })
    } catch (e: any) {
      error.value = e?.data?.message || 'Failed to send message'
    }
  }

  async function adminReply(content: string, replyToId: number, token: string) {
    error.value = ''
    try {
      await $fetch(`${apiBase}/chat/reply`, {
        method: 'POST',
        body: { name: 'Admin', content, replyToId },
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (e: any) {
      error.value = e?.data?.message || 'Failed to send reply'
    }
  }

  async function adminDelete(id: number, token: string) {
    try {
      await $fetch(`${apiBase}/chat/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (e: any) {
      error.value = e?.data?.message || 'Failed to delete message'
    }
  }

  async function loadMore() {
    if (messages.value.length === 0) return
    const oldest = messages.value[0]
    if (oldest) {
      const older = await fetchMessages(oldest.id)
      messages.value = [...older.reverse(), ...messages.value]
    }
  }

  return {
    messages,
    connected,
    error,
    connect,
    disconnect,
    sendMessage,
    adminReply,
    adminDelete,
    loadMore,
  }
}
