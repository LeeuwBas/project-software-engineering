<div align="left">

<img src="https://github.com/LeeuwBas/project-software-engineering/wiki/images/appicon_upper.png" width="60" align="right">

# VirtuoPet
</div>

VirtuoPet is a mobile app for Android designed to help people with Autism Spectrum Disorder (ASD) build healthy daily habits
by caring for a virtual pet. Rather than relying on gamification mechanics like streaks
or leaderboards, which [research suggests](https://github.com/LeeuwBas/project-software-engineering/wiki/Research) can increase anxiety in autistic users, 
VirtuoPet uses empathy as its core motivator. Caring for a virtual creature
provides immediate, emotionally meaningful feedback that bridges the gap between
intention and action.

## Install instructions

1. On your andriod, download the APK from the [latest GitHub release](https://github.com/LeeuwBas/project-software-engineering/releases/latest).
2. Open the downloaded file.
3. If prompted, allow "Install unknown apps" for the browser/file manager you used.
4. Tap Install, then Open.

## Developers:

Check out the wiki's homepage for an introduction to the project, or jump right to a specific page:

### [Wiki - Home](https://github.com/LeeuwBas/project-software-engineering/wiki)

- [Development Environment Setup](https://github.com/LeeuwBas/project-software-engineering/wiki/Development-Environment-Setup)

- [Engineering Standards](https://github.com/LeeuwBas/project-software-engineering/wiki/Engineering-Standards)

- [Style Guide](https://github.com/LeeuwBas/project-software-engineering/wiki/Style-Guide)

### Contributing:
In order to contributing, please open a Pull request ot the dev branch.

### Testing

In order to build the app you must:
- Clone the repository
- cd into `client/`
- install dependencies with `pnpm install`
- Optionally create and configure a .env file
- Run the app with expo go using `pnpm expo start`
- To use a dev build, instead run `pnpm expo run:android` with an emulator installed or an android device connected via USB

To run/test the server you must:
- Clone the repository
- cd into `server/`
- install dependencies with `pip install -r requirements.txt`
- Optionally create and configure a .env file
- Create the database with `python src/manage.py migrate`
- To run the server locally, run `python src/manage.py runserver`
- To run the unittests, run `python src/manage.py test api`

For more detailed build instructions, please refer to the [wiki](https://github.com/LeeuwBas/project-software-engineering/wiki/Development-Environment-Setup)

---

<p align="center">🔍︎ <a href="https://github.com/LeeuwBas/project-software-engineering/wiki">Wiki</a> · 🛠️ <a href="Credits">Credits</a> · 🐛 <a href="https://github.com/LeeuwBas/project-software-engineering/issues">Report an Issue</a></p>
