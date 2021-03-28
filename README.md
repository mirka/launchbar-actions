# LaunchBar Actions

Actions for [LaunchBar](https://www.obdev.at/products/launchbar/).

_Requires LaunchBar 6+._

## Table of Contents

<!-- Will be auto-generated in a pre-commit hook -->

<!-- toc -->

- [Actions](#actions)
  * [Code Scratchpad](#code-scratchpad)
  * [Copy Application Icon](#copy-application-icon)
  * [New File Here](#new-file-here)
  * [Relaunch Application](#relaunch-application)
  * [Speak In…](#speak-in)
- [Download](#download)

<!-- tocstop -->

## Actions

### Code Scratchpad

<img src="https://raw.githubusercontent.com/mirka/launchbar-actions/master/assets/code-scratchpad.gif" alt="Typing the extension 'json' into the LaunchBar input" width="480">

Open a temporary scratchpad file with a given extension.

This is for when you want to quickly type out a few lines of code, but with proper indentation and syntax highlighting. (The assumption being that, you have your Finder set up to open files with certain extensions in the code editor of your choice.)

### Copy Application Icon

Given an application, copy its icon to the clipboard.

### New File Here

Given a folder, create a new empty file inside it with a filename and extension specified from a prompt.

Unlike the built-in “New Text Document Here” action, it will not immediately open in a default app, but simply return it to LaunchBar. Also, you will not get a pesky confirmation dialog when choosing extensions other than `.txt`.

### Relaunch Application

Given an application, quit and relaunch it. If the app was running hidden, it will try to relaunch as hidden, too.

### Speak In…

<img src="https://raw.githubusercontent.com/mirka/launchbar-actions/master/assets/screen-speak-in.png" alt="Screenshot of the 'Speak In' plugin dropdown in LaunchBar" width="480">

Given some text, have the computer’s text-to-speech system read it out loud, choosing from a configurable list of languages/voices. You can also save it to an audio file, which can then be used in flashcard apps like [Anki](https://apps.ankiweb.net/). The list of languages are sorted by last used. Useful for polyglots and language learners.

Go to System Preferences ▸ Accessibility ▸ Speech ▸ System Voice to see what voices are available, and download more.

## Download

Download from the [latest release](https://github.com/mirka/launchbar-actions/releases/latest).
