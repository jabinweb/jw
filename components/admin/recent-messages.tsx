"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

const messages = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    message: "Interested in website development services",
    time: "2 hours ago",
  },
  // Add more sample messages...
]

export function RecentMessages() {
  return (
    <ScrollArea className="h-[350px]">
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-4">
            <Avatar>
              <AvatarFallback>{message.name[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="font-semibold">{message.name}</h4>
              <p className="text-sm text-muted-foreground">{message.message}</p>
              <p className="text-xs text-muted-foreground">{message.time}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
