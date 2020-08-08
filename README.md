# LaunchBar Actions

Actions for [LaunchBar](https://www.obdev.at/products/launchbar/).

_Requires LaunchBar 6+._

<!-- Will be auto-generated in a pre-commit hook -->

<!-- toc -->

- [Actions](#actions)
  * [Copy Application Icon](#copy-application-icon)
  * [New File Here](#new-file-here)
  * [Relaunch Application](#relaunch-application)
  * [Speak In…](#speak-in)

<!-- tocstop -->

## Actions

### Copy Application Icon

Given an application, copy its icon to the clipboard.

### New File Here

Given a folder, create a new empty file inside it with a filename and extension specified from a prompt.

Unlike the built-in “New Text Document Here” action, it will not immediately open in a default app, but simply return it to LaunchBar. Also, you will not get a pesky confirmation dialog when choosing extensions other than `.txt`.

### Relaunch Application

Given an application, quit and relaunch it. If the app was running hidden, it will try to relaunch as hidden, too.

### Speak In…

Given some text, have the computer’s text-to-speech system read it out loud, choosing from a configurable list of languages/voices. You can also save it to an audio file, which can then be used in flashcard apps like [Anki](https://apps.ankiweb.net/). Useful for polyglots and language learners.

Go to System Preferences ▸ Accessibility ▸ Speech ▸ System Voice to see what voices are available, and download more.
