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
    const query = "mindfulness meditacion guiada";
    try {
      await axios
        .get("http://localhost:4000/", {
          params: {
            query: query,
            maxResults: 50,
            nextPageToken: videos.nextPageToken,
          },
        })
        //.get("https://meditube.herokuapp.com/", { params: { query: query } })
        .then(function (response) {
          setVideos({
            items: [...videos.items, ...response.data.items],
            nextPageToken: response.data.nextPageToken,
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
            //.post("https://meditube.herokuapp.com/", {
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
