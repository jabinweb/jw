import { MediaManager } from "@/components/admin/media/media-manager";

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Media Library</h1>
        <p className="text-muted-foreground">
          Upload and manage images and documents for your website
        </p>
      </div>

      <MediaManager />
    </div>
  );
}
