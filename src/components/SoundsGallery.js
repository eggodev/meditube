import React, { useState, useEffect } from "react";
import axios from "axios";
import AudioPlayer from "./audioplayer/AudioPlayer";
import "./styles.css";
import "./audioplayer/styles.css";

const SoundsGallery = ({ videos }) => {
  const [video, setVideo] = useState({ id: null, key: null, play: false });
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    const gettingSound = async () => {
      try {
        await axios
          //.post("http://localhost:4000", {
          .post("https://meditube.herokuapp.com/", {
            videoID: video.id,
          })
          .then(function (response) {
            setAudio(response.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    if (video.id) {
      gettingSound();
    }
  }, [video.id]);

  const sendingVideoId = async (e, video, btnKey) => {
    e.currentTarget.classList.toggle("button-loading");
    setVideo({ id: video, key: btnKey, play: false });
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
              videos.map((item, key) => (
                <div key={key} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                  <div className="box bg-fondo rounded shadow">
                    <img
                      src={item.snippet.thumbnails.medium.url}
                      alt=""
                      className="img-fluid card-img-top"
                    />
                    <div className="p-4 videoTitle">
                      <h6 className="fw-bolder">
                        {formatString(item.snippet.title)}
                      </h6>
                      <p className="small text-muted mb-0">
                        {item.snippet.description}
                      </p>
                      <div className="d-flex justify-content-center mt-4">
                        {(!video.play || video.key !== key) && (
                          <button
                            type="button"
                            className="button-play"
                            onClick={(e) =>
                              sendingVideoId(e, item.id.videoId, key)
                            }
                          >
                            <span className="button__text">
                              <i className="fa-solid fa-play"></i>
                            </span>
                          </button>
                        )}
                        {video.play && video.key === key && (
                          <button
                            type="button"
                            className="button-microphone"
                            onClick={(e) =>
                              sendingVideoId(e, item.id.videoId, key)
                            }
                          >
                            <span className="button__text">
                              <i className="fa-solid fa-microphone"></i>
                            </span>
                          </button>
                        )}
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
      {audio && <AudioPlayer audio={audio} video={video} setVideo={setVideo} />}
    </>
  );
};

export default SoundsGallery;
