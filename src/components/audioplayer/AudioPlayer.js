import React, { useEffect } from "react";

import useAudio from "./useAudio";
import TimeBar from "./TimeBar";
import PlaybackButton from "./PlaybackButton";

function AudioPlayer({ audio, video, setVideo }) {
  const [audioElement, audioProps] = useAudio(audio.message);

  useEffect(() => {
    !audioProps.isLoading && setVideo({ ...video, play: true });
  }, [audioProps.isLoading]);

  return (
    <div className="controls">
      {typeof audio.success != "undefined" && !audio.success ? (
        <div style={{ color: "white" }}>{audio.message}</div>
      ) : (
        <>
          {audioElement}

          {audioProps.isLoading ? (
            <div style={{ color: "white" }}>Cargando...</div>
          ) : (
            <>
              {typeof audio.success != "undefined" && audio.success && (
                <>
                  <PlaybackButton
                    onClick={audioProps.togglePlaybackStatus}
                    playbackStatus={audioProps.playbackStatus}
                  />
                  <TimeBar
                    currentTime={audioProps.currentTime}
                    isSeeking={audioProps.isSeeking}
                    duration={audioProps.duration}
                    progress={audioProps.progress}
                    setTime={audioProps.setTime}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AudioPlayer;
