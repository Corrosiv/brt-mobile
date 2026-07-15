# Copilot Instructions

## Project Guidelines
- This repository is backend-only and no longer uses Flutter. 
- Do not add or reference Flutter unless the project structure changes.
- Keep documentation aligned with the current Node.js/Express and SQLite stack.
- Use 'dev' instead of 'master' as the primary branch name.
- Use 'main' and 'dev' branches instead of 'master'.

## Code Style
- Al recibir parámetros de ruta en Express (req.params), siempre convertir a número con parseInt() antes de usarlos en comparaciones estrictas (===) con valores numéricos de la base de datos (SQLite), ya que req.params entrega strings.

## Localization Preferences
- Keep test and debug output in clear Spanish, translating English terms like 'map' and 'ETA' when possible.
