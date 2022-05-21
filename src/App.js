import { useState, useEffect } from "react";
import axios from "axios";
import SoundsGallery from "./components/SoundsGallery";

function App() {
  const [videos, setVideos] = useState(null);

  useEffect(() => {
    const getYoutubeVideos = async () => {
      const query = "mindfulness meditacion guiada";
      try {
        await axios
          .get("https://meditube.herokuapp.com/", { params: { query: query } })
          .then(function (response) {
            setVideos(response.data.message);
            localStorage.setItem(
              "videoslS",
              JSON.stringify(response.data.message)
            );
          });
      } catch (error) {
        console.log(error);
      }
    };
    const videoslS = JSON.parse(localStorage.getItem("videoslS"));
    if (videoslS) {
      setVideos(videoslS);
    } else {
      getYoutubeVideos();
    }
  }, []);

  return (
    <>
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
      <div className="bottom_container">
        <div className="container">{<SoundsGallery videos={videos} />}</div>
      </div>
    </>
  );
}

export default App;
