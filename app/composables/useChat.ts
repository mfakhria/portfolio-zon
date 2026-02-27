import { io, Socket } from 'socket.io-client'

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
  // Derive WS base from API base (strip /api suffix)
  const apiBase = config.public.apiBase as string
  const wsBase = apiBase.replace(/\/api$/, '')

  const socket = ref<Socket | null>(null)
  const messages = ref<GuestMessage[]>([])
  const onlineCount = ref(0)
  const connected = ref(false)
  const error = ref('')

  function connect() {
    if (socket.value?.connected) return

    const s = io(`${wsBase}/chat`, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    })

    s.on('connect', () => {
      connected.value = true
      error.value = ''
      // Load initial messages
      s.emit('load_messages', {})
    })

    s.on('disconnect', () => {
      connected.value = false
    })

    s.on('messages_loaded', (data: GuestMessage[]) => {
      // Messages come in desc order, reverse for chronological display
      messages.value = data.reverse()
    })

    s.on('new_message', (msg: GuestMessage) => {
      // If it's a reply, attach to parent
      if (msg.replyToId) {
        const parent = messages.value.find((m) => m.id === msg.replyToId)
        if (parent) {
          if (!parent.replies) parent.replies = []
          parent.replies.push(msg)
          return
        }
      }
      messages.value.push(msg)
    })

    s.on('message_deleted', (data: { id: number }) => {
      messages.value = messages.value.filter((m) => m.id !== data.id)
    })

    s.on('online_count', (count: number) => {
      onlineCount.value = count
    })

    s.on('error_message', (data: { message: string }) => {
      error.value = data.message
    })

    socket.value = s
  }

  function disconnect() {
    socket.value?.disconnect()
    socket.value = null
    connected.value = false
  }

  function sendMessage(name: string, content: string, replyToId?: number) {
    if (!socket.value?.connected) return
    error.value = ''
    socket.value.emit('send_message', { name, content, replyToId })
  }

  function adminReply(content: string, replyToId: number, token: string) {
    if (!socket.value?.connected) return
    error.value = ''
    socket.value.emit('admin_reply', { content, replyToId, token })
  }

  function adminDelete(id: number, token: string) {
    if (!socket.value?.connected) return
    socket.value.emit('admin_delete', { id, token })
  }

  function loadMore() {
    if (!socket.value?.connected || messages.value.length === 0) return
    const oldest = messages.value[0]
    if (oldest) {
      socket.value.emit('load_messages', { cursor: oldest.id })
    }
  }

  return {
    messages,
    onlineCount,
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
