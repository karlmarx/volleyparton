# volleyparton.org

Pickleball team site. One page: `video.mp4` plays full screen on a loop.

To change the video, replace `video.mp4` (keep it small, H.264 MP4) and push to `main`. Vercel deploys automatically.

The video has no audio track (music removed for copyright). To swap in a new clip:

```sh
ffmpeg -i new-clip.mov -an -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart video.mp4
```

## After each game

Edit the top of `team.js`: update `RECORD` and set `NEXT_GAME` (ISO time with the UTC offset, e.g. `-05:00` once clocks fall back to EST). Both pages pick it up.
