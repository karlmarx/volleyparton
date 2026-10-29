# volleyparton.org

Pickleball team site. One page: `video.mp4` plays full screen on a loop.

To change the video, replace `video.mp4` (keep it small, H.264 MP4) and push to `main`. Vercel deploys automatically.

The video has no audio track (music removed for copyright). To swap in a new clip:

```sh
ffmpeg -i new-clip.mov -an -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart video.mp4
```

## After each game

Edit `GAMES` at the top of `team.js`: fill in `us`/`them` (games won) and a funny `title` for the episode guide, and update `SEASON` (rank, total points) from the league page. The record and countdown are computed from `GAMES`; the countdown moves to the next unplayed game on its own.
