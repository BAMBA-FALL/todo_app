Write-Host "🔧 Nettoyage en cours... veuillez patienter." -ForegroundColor Cyan

# 1️⃣ Nettoyage du cache Gradle
Remove-Item -Path "$env:USERPROFILE\.gradle\caches" -Recurse -Force -ErrorAction SilentlyContinue

# 2️⃣ Nettoyage du cache Android Studio
Remove-Item -Path "$env:USERPROFILE\.android\build-cache" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:LOCALAPPDATA\Google\AndroidStudio*" -Recurse -Force -ErrorAction SilentlyContinue

# 3️⃣ Nettoyage du dossier temporaire utilisateur
Remove-Item -Path "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue

# 4️⃣ Nettoyage des caches npm et Yarn
npm cache clean --force 2>$null
yarn cache clean 2>$null

# 5️⃣ Nettoyage des caches VSCode et logs
Remove-Item -Path "$env:APPDATA\Code\Cache" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\Code\CachedData" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\Code\logs" -Recurse -Force -ErrorAction SilentlyContinue

# 6️⃣ Nettoyage des caches système Windows
Remove-Item -Path "$env:LOCALAPPDATA\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:SystemRoot\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue

# 7️⃣ Vider la corbeille
Clear-RecycleBin -Force -ErrorAction SilentlyContinue

Write-Host "`nNettoyage termine avec succes !" -ForegroundColor Green