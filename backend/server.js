import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import YouTube from 'youtube-sr';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Falta el parámetro" });

    // " audio" to prioritize official audio tracks over MVs
    const response = await YouTube.search(q + " audio", { limit: 12, type: 'video' });
    const songs = response.map(item => ({
      id: item.id,
      title: item.title,
      artist: item.channel.name,
      thumbnail: item.thumbnail.url
    }));

    res.json(songs);
  } catch (error) {
    console.error("Error en búsqueda:", error);
    res.status(500).json({ error: "Error de conexión" });
  }
});

app.get('/api/related', async (req, res) => {
  try {
    const { artist } = req.query;
    if (!artist) return res.status(400).json({ error: "Falta el parámetro artist" });

    const response = await YouTube.search(artist, { limit: 5, type: 'video' });
    const songs = response.map(item => ({
      id: item.id,
      title: item.title,
      artist: item.channel.name,
      thumbnail: item.thumbnail.url
    }));

    res.json(songs);
  } catch (error) {
    console.error("Error en búsqueda relacionada:", error);
    res.status(500).json({ error: "Error de conexión" });
  }
});

app.get('/api/stream/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const videoUrl = `https://youtube.com/watch?v=${videoId}`;

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Transfer-Encoding', 'chunked');

    const ytDlpPath = 'yt-dlp';

    const ytdlp = spawn(ytDlpPath, [
      videoUrl,
      '-f', 'ba',                 // Best Audio
      '-x',                       // Extraer el audio
      '--audio-format', 'mp3',    // Convertir el flujo a MP3
      '-o', '-',                  // Enviar el flujo directamente a stdout
      '--no-playlist'             // Evitar descargar listas de reproducción
    ]);

    ytdlp.stdout.pipe(res);

    ytdlp.stderr.on('data', (data) => {
      console.log(`[yt-dlp info]: ${data}`);
    });

    ytdlp.on('close', (code) => {
      if (code !== 0) console.log(`Proceso yt-dlp finalizado con código: ${code}`);
    });

  } catch (error) {
    console.error("Error crítico en el endpoint de yt-dlp:", error);
    if (!res.headersSent) res.status(500).json({ error: "No se pudo procesar el audio" });
  }
});

app.listen(PORT, () => console.log(`🚀 WTC Music INFALIBLE corriendo en http://localhost:${PORT}`));
