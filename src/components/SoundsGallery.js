import React, { useState, useEffect } from "react";
import axios from "axios";
import AudioPlayer from "./audioplayer/AudioPlayer";
import "./styles.css";
import "./audioplayer/styles.css";
import LoadingButton from "@mui/lab/LoadingButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    btnColor: {
      main: "#4e537b",
      dark: "#44486A",
      contrastText: "#fff",
    },
  },
});

const SoundsGallery = ({ videos, setVideos }) => {
  const [video, setVideo] = useState({ data: null, key: null, play: false });
  const [audio, setAudio] = useState(null);
  const [slice, setSlice] = useState(12);
  const [loadedItems, setLoadedItems] = useState(
    videos.items.length >= 12 ? videos.items.slice(0, 12) : videos.items
  );
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if ((slice * 100) / videos.items.length > 70) {
      console.log("se va a buscar mas videoos");
      getMoreVideos();
    }
  }, [slice]);

  const getMoreVideos = async () => {
    let videoLength = null;
    switch (videos.duration) {
      case 33.33:
        videoLength = "short";
        console.log("short");
        break;
      case 66.66:
        videoLength = "medium";
        console.log("medium");
        break;
      case 100:
        videoLength = "long";
        console.log("long");
        break;
      default:
        videoLength = "any";
        console.log("any");
        break;
    }
    try {
      await axios
        .get("http://localhost:4000", {
          params: {
            query: videos.query,
            maxResults: 50,
            duration: videoLength,
            nextPageToken: videos.nextPageToken,
          },
        })
        .then(function (response) {
          setVideos({
            ...videos,
            items: [...videos.items, ...response.data.items],
            nextPageToken: response.data.nextPageToken,
            length: [...videos.length, ...response.data.length],
            error: response.data.error,
          });
          /*
          localStorage.setItem(
            "videoslS",
            JSON.stringify(response.data.message)
          );*/
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const gettingSound = async () => {
      try {
        await axios
          .post("http://localhost:4000", {
            videoID: video.data.id.videoId,
          })
          .then(function (response) {
            setAudio(response.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    if (video.data) {
      gettingSound();
    }
  }, [video.data]);

  useEffect(() => {
    if (!audio) {
      setVideo({ data: null, key: null, play: false });
    }
  }, [audio]);

  function loadMoreItems() {
    setIsFetching(true);

    //mocking an API call
    setTimeout(() => {
      setLoadedItems((prevState) => [
        ...prevState,
        ...videos.items.slice(
          slice,
          videos.items.length >= slice + 12
            ? slice + 12
            : videos.items.length - 1
        ),
      ]);
      setIsFetching(false);
    }, 2000);
    setSlice(slice + 12);
  }

  const handlingVideoData = async (e, video, btnKey) => {
    e.currentTarget.classList.toggle("button-loading");
    setVideo({ data: video, key: btnKey, play: false });
  };

  const formatString = (string) => {
    const str = string.toLowerCase();
    const str2 = str.charAt(0).toUpperCase() + str.slice(1);
    return str2;
  };

  const showDuration = (videoId) => {
    if (videos.items) {
      const item = videos.length.find((video) => video.id === videoId);
      const duration = `${parseInt(
        ((parseInt(item.duration.hours) > 0
          ? parseInt(item.duration.hours) * 3600000
          : 0) +
          (parseInt(item.duration.minutes) > 0
            ? parseInt(item.duration.minutes) * 60000
            : 0) +
          (parseInt(item.duration.seconds) > 0
            ? parseInt(item.duration.seconds) * 1000
            : 0)) /
          60000
      )} minutos`;

      return duration;
    }
    return "cero";
  };

  return (
    <>
      <div className="container">
        <div className="px-lg-5">
          <div className="row">
            {loadedItems &&
              loadedItems.map((item, key) => (
                <div key={key} className="col-xl-4 col-lg-4 col-md-6 mb-4">
                  <div className="box bg-bgColor rounded shadow">
                    <img
                      src={item.snippet.thumbnails.medium.url}
                      alt=""
                      className="img-fluid card-img-top"
                    />
                    <div className="p-4 videoTitle">
                      <div className="container-fluid m-0 p-0">
                        <h6 className="fw-bolder p-0 m-0">
                          {formatString(item.snippet.title)}
                        </h6>
                        <p className="p-0 small">
                          {showDuration(item.id.videoId)}
                        </p>
                      </div>

                      <p className="small text-muted mb-0">
                        {item.snippet.description}
                      </p>
                    </div>
                    <div className="container-fluid d-flex justify-content-center mb-3">
                      {(!video.play || video.key !== key) && (
                        <button
                          type="button"
                          className="button-play"
                          onClick={(e) => handlingVideoData(e, item, key)}
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
                          onClick={(e) => handlingVideoData(e, item, key)}
                        >
                          <span className="button__text">
                            <i className="fa-solid fa-microphone"></i>
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="d-flex justify-content-center my-5">
          <ThemeProvider theme={theme}>
            <LoadingButton
              onClick={loadMoreItems}
              loading={isFetching}
              loadingIndicator="Cargando..."
              color="btnColor"
              variant="contained"
            >
              Cargar más audios
            </LoadingButton>
          </ThemeProvider>
        </div>
      </div>

      {audio && (
        <AudioPlayer
          audio={audio}
          video={video}
          setVideo={setVideo}
          setAudio={setAudio}
        />
      )}
    </>
  );
};

export default SoundsGallery;
