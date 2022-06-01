import { useState, useEffect } from "react";
import axios from "axios";
import SoundsGallery from "./components/SoundsGallery";
import SkeletonShadow from "./components/SkeletonShadow";

function App() {
  const [videos, setVideos] = useState({
    items: false,
    nextPageToken: null,
    error: false,
  });

  useEffect(() => {
    const videoslS = JSON.parse(localStorage.getItem("videoslS"));
    if (videoslS) {
      setVideos(videoslS);
    } else {
      getVideos();
    }
  }, []);

  const getVideos = async () => {
    const query = "mindfulness meditacion guiada";
    try {
      await axios
        .get("http://localhost:4000/", {
          params: { query: query, maxResults: 50, nextPageToken: undefined },
        })
        //.get("https://meditube.herokuapp.com/", { params: { query: query } })
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
