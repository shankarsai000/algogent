# Demo assets

| File | Description |
|------|-------------|
| `demo.svg` | Animated product demo (works on GitHub README, no audio) |
| `demo.gif` | Raster GIF for embeds that prefer GIF (commit via local push) |
| `algogent-demo.mp4` | Full demo with audio (H.264 + AAC) |

## Add GIF / MP4 (binary)

GitHub API text tools cannot reliably push large binaries. From your machine:

```bash
# After downloading demo.gif and algogent-demo.mp4 from the project chat / artifacts
mkdir -p docs/assets
cp ~/Downloads/demo.gif docs/assets/demo.gif
cp ~/Downloads/algogent-demo.mp4 docs/assets/algogent-demo.mp4
git add docs/assets/demo.gif docs/assets/algogent-demo.mp4
git commit -m "docs: add product demo.gif and demo.mp4 with audio"
git push origin main
```

`demo.svg` is already in the repo and linked from the README.
