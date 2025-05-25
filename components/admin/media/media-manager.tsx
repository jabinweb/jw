"use client";

import { useState, useEffect, useCallback } from "react";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Trash2, RefreshCw, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface Media {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface MediaManagerProps {
  onSelect?: (url: string) => void;
  initialSelectedUrl?: string;
}

export function MediaManager({ onSelect, initialSelectedUrl }: MediaManagerProps) {
  const { toast } = useToast();
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(initialSelectedUrl || null);
  
  // Fetch media when the component mounts
  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/media');
      if (!response.ok) {
        throw new Error(`Failed to load media: ${response.status}`);
      }
      const data = await response.json();
      setMedia(data.items || []);
    } catch (error) {
      console.error("Error fetching media:", error);
      toast({
        title: "Error loading media",
        description: "Failed to load your media files",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // Delete a media item
  const deleteMedia = async (id: string) => {
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error("Failed to delete");
      
      // Update list after deletion
      setMedia(media.filter(item => item.id !== id));
      toast({
        title: "Media deleted",
        description: "File has been removed"
      });
      
      // Clear selection if deleted
      if (selectedMedia === id) {
        setSelectedMedia(null);
      }
    } catch (error) {
      toast({
        title: "Error deleting media",
        description: "Failed to delete the file",
        variant: "destructive"
      });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: "Image URL copied to clipboard"
    });
  };

  const handleSelect = (url: string) => {
    setSelectedMedia(url);
    if (onSelect) onSelect(url);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <div className="mb-6">
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                toast({
                  title: "Upload complete",
                  description: `${res.length} files uploaded successfully`
                });
                // Add a small delay before fetching to ensure the server has time to process
                setTimeout(fetchMedia, 500);
              }}
              onUploadError={(error) => {
                toast({
                  title: "Upload failed",
                  description: error.message,
                  variant: "destructive"
                });
              }}
            />
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Or use the button</p>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                toast({
                  title: "Upload complete",
                  description: `${res.length} files uploaded successfully`
                });
                // Add a small delay before fetching to ensure the server has time to process
                setTimeout(fetchMedia, 500);
              }}
              onUploadError={(error) => {
                toast({
                  title: "Upload failed",
                  description: error.message,
                  variant: "destructive"
                });
              }}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="library">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Media Library</h3>
            <Button variant="outline" size="sm" onClick={fetchMedia}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-square bg-muted rounded-md animate-pulse" />
              ))}
            </div>
          ) : media.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {media.map((item) => (
                <div 
                  key={item.id} 
                  className={`aspect-square relative rounded-md overflow-hidden border-2 cursor-pointer group ${
                    selectedMedia === item.url ? "border-primary" : "border-transparent hover:border-muted"
                  }`}
                  onClick={() => handleSelect(item.url)}
                >
                  {item.type.includes('image') ? (
                    <Image 
                      src={item.url} 
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-muted">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="icon" 
                      variant="outline"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyUrl(item.url);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMedia(item.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No media files found. Upload some files to see them here.
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedMedia && onSelect && (
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onSelect(selectedMedia)}>
            Use Selected Image
          </Button>
        </div>
      )}
    </div>
  );
}
