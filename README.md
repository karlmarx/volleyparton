# volleyparton.org

Pickleball team site. One page: `video.mp4` plays full screen on a loop.

To change the video, replace `video.mp4` (keep it small, H.264 MP4) and push to `main`. Vercel deploys automatically.

The video has no audio track (music removed for copyright). To swap in a new clip:

```sh
ffmpeg -i new-clip.mov -an -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart video.mp4
```

## Scores update themselves

`.github/workflows/update-season.yml` runs `scripts/update-season.mjs` on Saturday afternoon, Saturday evening and Sunday morning. The script pulls our games, scores and standing from the [league page](https://pridesportsusa.com/register/rp_fpjif5), rewrites `season.js`, and commits only if something changed. Vercel deploys the commit.

- **Episode titles:** add them to `titles.json`, keyed by game date (`YYYY-MM-DD`). They're merged in on the next run.
- **Run it now:** GitHub → Actions → "Update season from league site" → Run workflow.
- **If it fails** (the league site changed), GitHub emails you and the site keeps the last good data.
- **Next season:** change `PROGRAM_ID` in the script to the new registration page's ID.
