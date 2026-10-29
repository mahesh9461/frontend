"use client";

import { useState, useCallback } from "react";
import { Download, Play, Music2 } from "lucide-react";
import { Header } from "@/components/header";
import { UrlInput } from "@/components/url-input";
import { VideoPreview } from "@/components/video-preview";
import { DownloadOptions } from "@/components/download-options";
import { ProgressBar } from "@/components/progress-bar";
import { HistoryDrawer } from "@/components/history-drawer";
import { ErrorBanner } from "@/components/error-banner";
import { useDownload } from "@/hooks/use-download";
import { useHistory } from "@/hooks/use-history";

export default function Home() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [activeFormatId, setActiveFormatId] = useState<string | null>(null);

  const {
    metadata,
    progress,
    isLoadingMetadata,
    isDownloading,
    error,
    errorType,
    fetchMetadata,
    startDownload,
    cancelDownload,
    clearError,
    reset,
  } = useDownload();

  const { history, addToHistory, clearHistory, removeFromHistory } = useHistory();

  const handleUrlSubmit = useCallback(
    (url: string) => {
      setCurrentUrl(url);
      reset();
      fetchMetadata(url);
    },
    [fetchMetadata, reset]
  );

  const handleDownload = useCallback(
    (formatId: string, label: string) => {
      setActiveFormatId(formatId);
      startDownload(currentUrl, formatId);

      // Add to history when download starts
      if (metadata) {
        addToHistory({
          platform: metadata.platform,
          title: metadata.title,
          thumbnail: metadata.thumbnail,
          creator: metadata.creator,
          format: label,
          filesize: null,
        });
      }
    },
    [currentUrl, metadata, startDownload, addToHistory]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenHistory={() => setHistoryOpen(true)} historyCount={history.length} />

      <main className="flex-1 flex flex-col items-center px-4 pt-12 sm:pt-20 pb-16">
        {/* Hero */}
        <div className="text-center space-y-4 mb-10 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Download videos in seconds
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Paste a link from YouTube or TikTok and download in any quality.
            <br className="hidden sm:block" />
            No watermarks, no sign-ups, completely free.
          </p>

          {/* Platform indicators */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-900/50 border border-zinc-800 rounded-full px-3 py-1.5">
              <Play className="w-3.5 h-3.5 text-red-500" />
              YouTube
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-900/50 border border-zinc-800 rounded-full px-3 py-1.5">
              <Music2 className="w-3.5 h-3.5 text-cyan-400" />
              TikTok
            </div>
          </div>
        </div>

        {/* URL Input */}
        <div className="w-full max-w-2xl">
          <UrlInput
            onSubmit={handleUrlSubmit}
            isLoading={isLoadingMetadata}
            disabled={isDownloading}
          />
        </div>

        {/* Content Area */}
        <div className="w-full max-w-2xl mt-8 space-y-6">
          {/* Error Banner */}
          {error && (
            <ErrorBanner
              message={error}
              type={errorType}
              onDismiss={clearError}
            />
          )}

          {/* Video Preview Card */}
          <VideoPreview metadata={metadata} isLoading={isLoadingMetadata} />

          {/* Download Options */}
          {metadata && !isLoadingMetadata && (
            <DownloadOptions
              metadata={metadata}
              onDownload={handleDownload}
              isDownloading={isDownloading}
              activeFormatId={activeFormatId}
            />
          )}

          {/* Progress Bar */}
          {progress && <ProgressBar progress={progress} />}
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-16 text-center">
          <p className="text-xs text-zinc-700">
            Built for personal use. Respect content creators&apos; rights.
          </p>
        </footer>
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        history={history}
        onClear={clearHistory}
        onRemove={removeFromHistory}
      />
    </div>
  );
}
