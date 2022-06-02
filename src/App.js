import { useState, useEffect } from "react";
import axios from "axios";
import SoundsGallery from "./components/SoundsGallery";
import SkeletonShadow from "./components/SkeletonShadow";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";

function App() {
  const [videos, setVideos] = useState({
    items: false,
    nextPageToken: null,
    error: false,
  });

  const [search, setSearch] = useState({ term: "", active: false });

  useEffect(() => {
    if (!videos.items) {
      getVideos();
    }
  }, [videos.items]);

  useEffect(() => {
    if (search.active) {
      setVideos({ items: false, nextPageToken: null, error: false });
    }
  }, [search.active]);

  const getVideos = async () => {
    const query = `mindfulness meditacion guiada ${search.term}`;
    try {
      await axios
        .get("https://meditube.herokuapp.com/", {
          params: { query: query, maxResults: 50, nextPageToken: undefined },
        })
        .then(function (response) {
          setVideos({
            items: response.data.items,
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

  const onSubmit = (e) => {
    e.preventDefault();
    setSearch({ ...search, active: true });
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
                setSearch({ term: e.target.value, active: false })
              }
            />
            <IconButton type="submit" sx={{ p: "5px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </div>
      </div>
      <div className="container-fluid">
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
