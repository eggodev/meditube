import { useState, useEffect } from "react";
import axios from "axios";
import SoundsGallery from "./components/SoundsGallery";
import SkeletonShadow from "./components/SkeletonShadow";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const marks = [
  {
    value: 0,
    label: "Todos",
  },
  {
    value: 33.33,
    label: "< 4min",
  },
  {
    value: 66.66,
    label: "4 - 20min",
  },
  {
    value: 100,
    label: "> 20min",
  },
];

function App() {
  const [videos, setVideos] = useState({
    query: "mindfulness meditacion guiada",
    search: false,
    items: false,
    nextPageToken: null,
    duration: null,
    length: null,
    error: false,
  });

  useEffect(() => {
    console.log(videos);
  }, [videos]);

  useEffect(() => {
    if (!videos.items) {
      getVideos();
    }
  }, [videos.items]);

  useEffect(() => {
    if (videos.search) {
      setVideos({
        ...videos,
        items: false,
        nextPageToken: null,
        length: null,
        error: false,
      });
    }
  }, [videos.search]);

  const getVideos = async () => {
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
            nextPageToken: undefined,
          },
        })
        .then(function (response) {
          setVideos({
            ...videos,
            items: response.data.items,
            nextPageToken: response.data.nextPageToken,
            length: response.data.length,
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

  const onSubmit = (e) => {
    e.preventDefault();
    setVideos({ ...videos, search: true });
  };

  const changeVideoDuration = (e, value) => {
    setVideos({
      ...videos,
      items: false,
      nextPageToken: null,
      duration: value,
      length: null,
      error: false,
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="top-container">
        <form method="POST" id="form">
          <h1 className="title">
            <i className="fa-solid fa-brain">&nbsp;</i>Meditube
          </h1>
          <h4 className="fw-light">
            Elige un audio para disfrutar meditando...
          </h4>
        </form>
        <div className="search">
          <Paper
            component="form"
            onSubmit={onSubmit}
            sx={{
              p: "2px 2px",
              display: "flex",
              alignItems: "center",
              width: 300,
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Ej: para dormir, ansiedad..."
              inputProps={{ "aria-label": "search" }}
              onChange={(e) =>
                setVideos({
                  ...videos,
                  query:
                    e.target.value === ""
                      ? "mindfulness meditacion guiada"
                      : "mindfulness meditacion guiada " + e.target.value,
                  search: false,
                })
              }
            />
            <IconButton type="submit" sx={{ p: "5px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </div>
      </div>
      <div className="container-fluid">
        <div className="mb-4 d-flex justify-content-center">
          <Box sx={{ width: 300 }}>
            <Slider
              aria-label="Restricted values"
              defaultValue={0}
              onChange={changeVideoDuration}
              step={null}
              valueLabelDisplay="off"
              marks={marks}
            />
          </Box>
        </div>
        {!videos.items && !videos.error && <SkeletonShadow />}
        {videos.items ? (
          videos.items.length > 0 ? (
            <SoundsGallery videos={videos} setVideos={setVideos} />
          ) : (
            <span>
              No se encontró ningun resultado a la búsqueda. Intente una nueva.
            </span>
          )
        ) : null}
        {videos.error && <span>Ocurrió un error. Intentelo más tarde...</span>}
      </div>
      <footer className="footer mt-auto">
        <div
          className="text-center p-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          © 2022 Copyright:&nbsp;
          <a href="https://github.com/eggodev">eggodev</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
