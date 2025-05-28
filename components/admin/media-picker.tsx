"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Search, Image as ImageIcon, Check, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { UploadButton, UploadDropzone } from "@/lib/uploadthing"
import Image from "next/image"

interface MediaItem {
  id: string
  url: string
  name: string
  type: string
  size: number
  createdAt: string
}

interface MediaPickerProps {
  onSelect: (media: MediaItem) => void
  selectedUrl?: string
  accept?: string
  allowMultiple?: boolean
}

export function MediaPicker({ onSelect, selectedUrl, accept = "image/*", allowMultiple = false }: MediaPickerProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>(selectedUrl ? [selectedUrl] : [])
  const [uploadedFiles, setUploadedFiles] = useState<MediaItem[]>([])

  // Fetch media library
  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/media')
      if (response.ok) {
        const data = await response.json()
        setMedia(data.items || data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load media library",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleItemClick = (item: MediaItem) => {
    if (allowMultiple) {
      setSelectedItems(prev => {
        const isSelected = prev.includes(item.url)
        if (isSelected) {
          return prev.filter(url => url !== item.url)
        } else {
          return [...prev, item.url]
        }
      })
    } else {
      setSelectedItems([item.url])
      onSelect(item)
    }
  }

  const handleConfirmSelection = () => {
    if (selectedItems.length > 0) {
      const selectedItem = [...media, ...uploadedFiles].find(item => item.url === selectedItems[0])
      if (selectedItem) {
        onSelect(selectedItem)
      }
    }
  }

  const clearSelection = () => {
    setSelectedItems([])
  }

  const allMedia = [...uploadedFiles, ...media]
  const filteredMedia = allMedia.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUploadComplete = async (res: any[]) => {
    for (const uploadedFile of res) {
      // Create a temporary media item for immediate use
      const tempMedia = {
        id: uploadedFile.key,
        url: uploadedFile.url,
        name: uploadedFile.name,
        type: uploadedFile.type || 'image/*',
        size: uploadedFile.size,
        createdAt: new Date().toISOString()
      }
      
      // Add to uploaded files state
      setUploadedFiles(prev => [tempMedia, ...prev])
      
      // Auto-select the uploaded image
      setSelectedItems([tempMedia.url])
      
      // Try to save to database in background
      try {
        const response = await fetch('/api/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: uploadedFile.url,
            name: uploadedFile.name,
            type: uploadedFile.type,
            size: uploadedFile.size,
            key: uploadedFile.key
          })
        })

        if (response.ok) {
          const savedMedia = await response.json()
          // Update the temp media with the saved version
          setUploadedFiles(prev => prev.map(item => 
            item.id === uploadedFile.key ? savedMedia : item
          ))
          
          // Also refresh the main media list
          fetchMedia()
        } else {
          const errorData = await response.json()
          console.error('Database save error:', errorData)
        }
      } catch (error) {
        console.error('Database save error:', error)
      }
    }
    
    toast({
      title: "Success",
      description: `${res.length} image(s) uploaded successfully`
    })
  }

  const handleUploadError = (error: Error) => {
    toast({
      title: "Error",
      description: `Upload failed: ${error.message}`,
      variant: "destructive"
    })
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="library">Media Library</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
        </TabsList>
        
        <TabsContent value="library" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selection Controls */}
          {selectedItems.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border">
              <span className="text-sm font-medium">
                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearSelection}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={handleConfirmSelection}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Use Selected
                </Button>
              </div>
            </div>
          )}

          {/* Media Grid */}
          <ScrollArea className="h-96 w-full border rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
                {filteredMedia.map((item) => {
                  const isSelected = selectedItems.includes(item.url)
                  const isUploadedFile = uploadedFiles.some(f => f.id === item.id)
                  
                  return (
                    <Card
                      key={item.id}
                      className={`relative cursor-pointer hover:ring-2 hover:ring-primary transition-all ${
                        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="aspect-square relative overflow-hidden rounded-lg">
                        <Image
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          height={100}
                          width={100}
                          unoptimized
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Check className="h-6 w-6 text-primary bg-white rounded-full p-1" />
                          </div>
                        )}
                        {isUploadedFile && (
                          <div className="absolute top-1 left-1">
                            <div className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                              New
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(item.size / 1024).toFixed(1)}KB
                        </p>
                      </div>
                    </Card>
                  )
                })}
                {filteredMedia.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    {searchQuery ? 'No images found' : 'No images in library'}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4">
          {/* Show uploaded files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Recently Uploaded</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {uploadedFiles.map((file) => {
                  const isSelected = selectedItems.includes(file.url)
                  return (
                    <Card
                      key={file.id}
                      className={`relative cursor-pointer hover:ring-2 hover:ring-primary transition-all ${
                        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                      onClick={() => handleItemClick(file)}
                    >
                      <div className="aspect-square relative overflow-hidden rounded-lg">
                        <Image
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          height={100}
                          width={100}
                          unoptimized
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Check className="h-6 w-6 text-primary bg-white rounded-full p-1" />
                          </div>
                        )}
                        <div className="absolute top-1 right-1">
                          <div className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                            New
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-xs truncate">{file.name}</p>
                      </div>
                    </Card>
                  )
                })}
              </div>
              {selectedItems.length > 0 && (
                <div className="flex justify-end">
                  <Button onClick={handleConfirmSelection}>
                    <Check className="h-4 w-4 mr-1" />
                    Use Selected Image
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Drag & Drop Upload Area */}
          <div className="space-y-4">
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
            />
            
            {/* Alternative Upload Button */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">Or use the button to browse files</p>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
