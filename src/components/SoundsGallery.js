import React, { useState, useEffect } from "react";
import axios from "axios";
import AudioPlayer from "./audioplayer/AudioPlayer";
import "./styles.css";
import "./audioplayer/styles.css";

const SoundsGallery = ({ videos }) => {
  const [videoId, setVideoId] = useState(null);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    const gettingSound = async () => {
      try {
        await axios
          .post("http://localhost:4000", {
            videoID: videoId,
          })
          .then(function (response) {
            setAudio(response.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    if (videoId) {
      gettingSound();
    }
  }, [videoId]);

  const sendingVideoId = async (e, video) => {
    e.currentTarget.classList.toggle("button--loading");
    setVideoId(video);
  };

  const formatString = (string) => {
    const str = string.toLowerCase();
    const str2 = str.charAt(0).toUpperCase() + str.slice(1);
    return str2;
  };

  return (
    <>
      <div className="container-fluid">
        <div className="px-lg-3">
          <div className="row">
            {videos &&
              videos.map((video, key) => (
                <div key={key} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                  <div className="box bg-fondo rounded shadow">
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt=""
                      className="img-fluid card-img-top"
                    />
                    <div className="p-4 videoTitle">
                      <h6 className="fw-bolder">
                        {formatString(video.snippet.title)}
                      </h6>
                      <p className="small text-muted mb-0">
                        {video.snippet.description}
                      </p>
                      <div className="d-flex justify-content-center mt-4">
                        <button
                          type="button"
                          className="button"
                          onClick={(e) => sendingVideoId(e, video.id.videoId)}
                        >
                          <span className="button__text">
                            <i className="fa-solid fa-play"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="py-5 text-right">
            <a href="#" className="btn btn-dark px-5 py-3 text-uppercase">
              Show me more
            </a>
          </div>
        </div>
      </div>
      {audio && <AudioPlayer audio={audio} />}
    </>
  );
};

export default SoundsGallery;
