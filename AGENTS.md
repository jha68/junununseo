# Portfolio workflow

- This repository serves the public portfolio at https://junununseo.com/ through GitHub Pages. The publishing source is `main`, repository root. Preserve `CNAME` and the existing hosting setup.
- The owner wants completed website updates published by default so they can check the result at the custom domain. Treat future requests to update this portfolio as authorization to commit and publish those changes, unless the user explicitly requests local-only work, a preview, or no deployment. Do not ask for publishing confirmation again.
- Fetch and incorporate the latest `origin/main` before publishing. Preserve changes made by others. Never force-push or include unrelated work.
- Check the changes before publishing. Keep all substantive portfolio content in the initial HTML response, preserve reduced-motion and JavaScript-disabled reading, and keep `portfolio.txt` and `llms.txt` aligned with the page.
- Run `python3 scripts/version-assets.py` before committing to refresh content-based CSS, JavaScript, and favicon URL versions. This prevents cached assets from carrying an old design into a new deployment.
- Publish with a normal push to `main`; the existing GitHub Pages build deploys automatically. Confirm that the Pages run for the published commit succeeds and verify the live URL when available. Report deployment or verification failures candidly; do not describe unverified local work as live.
