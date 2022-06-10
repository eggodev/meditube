# MEDITUBE - MEDITANDO CON YOUTUBE

Es un sitio donde se puede reproducir audios sobre meditación mindfulness. 
Se puede buscar meditaciones específicas como por ejemplo para la ansiedad, el miedo, o dormir mejor. Tambien se puede filtrar por duración del audio. Es #responsive asi que puede ser accesado desde el movil.

El frontend está hecho con #reactJs y #bootstrap, y deployado en #github_pages.

El backend esta desarrollado en #nodeJs y su fw #express, y deployado en #heroku.

El contenido consiste en videos publicos de Youtube, los cuales obtengo gracias a su #youtube_api_v3, y los convierto en tiempo real en audios para asi poder ser reproducidos en segundo plano en el móvil. Para hacerlo uso la libreria #ytdl_core.
