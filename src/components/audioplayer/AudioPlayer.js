import React, { useEffect } from "react";

import useAudio from "./useAudio";
import TimeBar from "./TimeBar";
import PlaybackButton from "./PlaybackButton";
import Modal from "react-bootstrap/Modal";
import "./styles.css";

function AudioPlayer({ audio, video, setVideo, setAudio }) {
  const [audioElement, audioProps] = useAudio(audio.message);

  useEffect(() => {
    !audioProps.isLoading && setVideo({ ...video, play: true });
  }, [audioProps.isLoading]);

  const handleClose = () => setAudio(null);

  return (
    <Modal
      show={true}
      animation={false}
      contentClassName="custom-modal"
      onHide={handleClose}
      centered
    >
      <div className="mask gradient-card align-items-center">
        <div
          className="position-absolute d-flex justify-content-end"
          style={{ top: "10px", right: "10px" }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="btn-close btn-close-white"
            aria-label="Close"
          ></button>
        </div>
        <div className="container d-flex justify-content-center my-5 mb-5">
          <div id="mobile-box">
            {typeof audio.success != "undefined" && !audio.success ? (
              <div style={{ color: "white" }}>{audio.message}</div>
            ) : (
              <>
                {audioElement}
                {audioProps.isLoading ? (
                  <div
                    className="d-flex justify-content-center"
                    style={{ color: "white" }}
                  >
                    Cargando...
                  </div>
                ) : (
                  <div className="shadow-sm rounded-3">
                    <div>
                      <img
                        className="card-img-top rounded-top"
                        src={video.data.snippet.thumbnails.medium.url}
                        alt="meditation"
                        border="0"
                      />
                    </div>
                    <div className="card border-0">
                      <div className="card-body text-center">
                        <p className="mb-0">{video.data.snippet.title}</p>

                        <div id="audioplayer">
                          <div className="d-flex justify-content-center mt-4">
                            <PlaybackButton
                              onClick={audioProps.togglePlaybackStatus}
                              playbackStatus={audioProps.playbackStatus}
                            />
                          </div>
                          <div>
                            <TimeBar
                              currentTime={audioProps.currentTime}
                              isSeeking={audioProps.isSeeking}
                              duration={audioProps.duration}
                              progress={audioProps.progress}
                              setTime={audioProps.setTime}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AudioPlayer;
