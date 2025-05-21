'use client';

import { useEffect, useState } from "react";
import Image from 'next/image';

// Define the type for the subsite API response
interface Subsite {
  name: string;
  url: string;
}

export default function PortfolioPage() {
  const [subsites, setSubsites] = useState<Subsite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubsites = async () => {
      try {
        const response = await fetch(
          "https://demos.jabin.org/wp-json/multisite/v1/subsites"
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch subsites: ${response.statusText}`);
        }

        // Parse JSON response with type assertion
        const data: Subsite[] = await response.json();

        // Filter out the base URL
        const filteredSubsites = data.filter(
          (site) => site.url !== "https://demos.jabin.org"
        );

        setSubsites(filteredSubsites);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubsites();
  }, []);

  return (
    <div className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold text-primary">Portfolio</h1>
        <p className="mb-12 text-lg text-muted-foreground">
          Explore the demo websites we&apos;ve built.
        </p>
      </div>

      {loading && (
        <p className="text-center text-lg text-muted-foreground">
          Loading subsites...
        </p>
      )}
      {error && (
        <p className="text-center text-lg text-red-500">{error}</p>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        {subsites.map((site) => (
          <div
            key={site.url}
            className="border rounded-lg p-4 shadow-md bg-background hover:shadow-lg transition"
          >
            <h4 className="font-semibold text-primary">{site.name}</h4>
            <SkeletonImage url={site.url} />
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-primary text-background text-center py-2 px-4 rounded hover:bg-primary-dark transition"
            >
              View Live Demo
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonImage({ url }: { url: string }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-full aspect-video rounded bg-muted overflow-hidden">
      {!imageLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-700"></div>
      )}
      <Image
        src={`https://jabin-screenshot-api.vercel.app/screenshot?url=${encodeURIComponent(
          url
        )}`}
        alt="Website Screenshot"
        width={500}
        height={300}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
}
