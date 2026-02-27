<script setup lang="ts">
import { Trash2, Reply, Send, ArrowLeft, MessageCircle } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { GuestMessage } from '~/composables/useChat'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { messages, connected, error, connect, disconnect, adminReply, adminDelete } = useChat()
const token = useCookie('admin_token')

const replyingTo = ref<GuestMessage | null>(null)
const replyContent = ref('')
const chatContainer = ref<HTMLElement | null>(null)

function handleReply(msg: GuestMessage) {
  replyingTo.value = msg
  replyContent.value = ''
}

function submitReply() {
  if (!replyingTo.value || !replyContent.value.trim() || !token.value) return
  adminReply(replyContent.value.trim(), replyingTo.value.id, token.value)
  replyContent.value = ''
  replyingTo.value = null
}

function handleDelete(id: number) {
  if (!confirm('Delete this message?')) return
  if (!token.value) return
  adminDelete(id, token.value)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Auto-scroll on new messages
watch(
  () => messages.value.length,
  () => {
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    })
  },
)

onMounted(connect)
onUnmounted(disconnect)
</script>

<template>
  <div>
    <div class="mb-6 space-y-3">
      <NuxtLink
        to="/admin"
        class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group"
      >
        <ArrowLeft class="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </NuxtLink>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold font-retro text-primary retro-glow">Guest Book</h1>
          <div class="flex items-center gap-1.5">
            <span class="relative flex h-2 w-2">
              <span
                :class="[
                  'absolute inline-flex h-full w-full rounded-full opacity-75',
                  connected ? 'animate-ping bg-emerald-400' : 'bg-red-400',
                ]"
              />
              <span
                :class="['relative inline-flex h-2 w-2 rounded-full', connected ? 'bg-emerald-500' : 'bg-red-500']"
              />
            </span>
            <span class="text-xs text-muted-foreground">{{ connected ? 'Live' : 'Offline' }}</span>
          </div>
        </div>
        <Badge variant="default" class="text-xs">
          {{ messages.length }} messages
        </Badge>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-400">
      {{ error }}
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <!-- Messages panel -->
      <Card class="border-primary/20 lg:col-span-2">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm flex items-center gap-2">
            <MessageCircle class="h-4 w-4" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent class="p-0">
          <div
            ref="chatContainer"
            class="h-[60vh] overflow-y-auto p-4 space-y-3"
          >
            <!-- Empty state -->
            <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageCircle class="h-12 w-12 mb-3 opacity-30" />
              <p class="text-sm">No guest messages yet.</p>
            </div>

            <!-- Messages -->
            <div
              v-for="msg in messages"
              :key="msg.id"
              :class="[
                'group rounded-lg border p-3 transition-colors',
                msg.isAdmin ? 'border-primary/30 bg-primary/5' : 'border-border/50 hover:border-border',
              ]"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-2">
                  <div
                    :class="[
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold uppercase',
                      msg.isAdmin
                        ? 'bg-primary/20 text-primary ring-1 ring-primary/30'
                        : 'bg-muted text-muted-foreground ring-1 ring-border',
                    ]"
                  >
                    {{ msg.isAdmin ? '★' : msg.name.charAt(0) }}
                  </div>
                  <div>
                    <span :class="['text-sm font-semibold', msg.isAdmin && 'text-primary']">
                      {{ msg.isAdmin ? '✦ Admin' : msg.name }}
                    </span>
                    <span class="ml-2 text-[10px] text-muted-foreground">{{ formatDate(msg.createdAt) }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    v-if="!msg.isAdmin"
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 p-0 text-primary hover:text-primary hover:bg-primary/10"
                    @click="handleReply(msg)"
                  >
                    <Reply class="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    @click="handleDelete(msg.id)"
                  >
                    <Trash2 class="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <p class="mt-2 text-sm text-foreground/90 pl-9">{{ msg.content }}</p>

              <!-- Replies -->
              <div v-if="msg.replies?.length" class="mt-2 pl-9 space-y-2 border-l-2 border-primary/10 ml-3">
                <div
                  v-for="reply in msg.replies"
                  :key="reply.id"
                  class="group/reply flex items-start justify-between gap-2 pl-3"
                >
                  <div class="flex gap-2">
                    <div
                      :class="[
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold uppercase',
                        reply.isAdmin
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground',
                      ]"
                    >
                      {{ reply.isAdmin ? '★' : reply.name.charAt(0) }}
                    </div>
                    <div>
                      <span :class="['text-[10px] font-semibold', reply.isAdmin && 'text-primary']">
                        {{ reply.isAdmin ? '✦ Admin' : reply.name }}
                      </span>
                      <span class="ml-1 text-[9px] text-muted-foreground">{{ formatDate(reply.createdAt) }}</span>
                      <p class="text-xs text-foreground/80">{{ reply.content }}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-5 w-5 p-0 text-destructive opacity-0 group-hover/reply:opacity-100 transition-opacity"
                    @click="handleDelete(reply.id)"
                  >
                    <Trash2 class="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Reply panel -->
      <Card class="border-primary/20 h-fit">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm flex items-center gap-2">
            <Reply class="h-4 w-4" />
            Quick Reply
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="replyingTo" class="space-y-3">
            <div class="rounded-md bg-muted/30 border border-border/50 p-3">
              <p class="text-xs text-muted-foreground mb-1">Replying to:</p>
              <p class="text-sm font-semibold">{{ replyingTo.name }}</p>
              <p class="text-xs text-muted-foreground mt-1 line-clamp-3">{{ replyingTo.content }}</p>
            </div>
            <form @submit.prevent="submitReply" class="space-y-2">
              <Input
                v-model="replyContent"
                placeholder="Type your reply..."
                maxlength="500"
                required
                @keydown.enter.exact.prevent="submitReply"
              />
              <div class="flex gap-2">
                <Button type="submit" size="sm" class="flex-1" :disabled="!replyContent.trim()">
                  <Send class="h-3.5 w-3.5 mr-1.5" />
                  Send Reply
                </Button>
                <Button type="button" variant="outline" size="sm" @click="replyingTo = null">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
          <div v-else class="text-center py-8 text-muted-foreground">
            <Reply class="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p class="text-sm">Click the reply button on a message to respond.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
