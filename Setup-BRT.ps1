# Funciones helper para ejecutar Flutter y Node.js sin problemas de terminal

# Crear atajo para flutter
function flutter {
	& 'C:\Users\Admin\.puro\envs\stable\flutter\bin\flutter.bat' @args
}

# Crear atajo para dart  
function dart {
	& 'C:\Users\Admin\.puro\envs\stable\flutter\bin\dart.bat' @args
}

# Funcion para abrir una nueva terminal de Backend
function Start-Backend {
	Start-Process powershell -ArgumentList "-NoExit", "-Command `"cd 'C:\Users\Admin\source\repos\brt-mobile\brt-backend'; npm install; npm run init-db; npm run seed; npm start`""
	Write-Host "OK - Terminal de Backend abierta en nueva ventana" -ForegroundColor Green
}

# Funcion para abrir una nueva terminal para el Emulador
function Start-Emulator {
	Write-Host ""
	Write-Host "Emuladores disponibles:" -ForegroundColor Yellow
	flutter emulators
	Write-Host ""
	$emulatorName = Read-Host "Ingresa el nombre del emulador (o deja en blanco para crear uno nuevo)"

	if ($emulatorName -eq "") {
		Write-Host ""
		Write-Host "Creando nuevo emulador..." -ForegroundColor Cyan
		$newName = Read-Host "Nombre del nuevo emulador (default: brt_device)"
		if ($newName -eq "") { $newName = "brt_device" }
		Write-Host "Creando emulador: $newName" -ForegroundColor Green
		flutter emulators --create --name $newName
		$emulatorName = $newName
	}

	if ($emulatorName) {
		Start-Process powershell -ArgumentList "-NoExit", "-Command `"flutter emulators --launch $emulatorName`""
		Write-Host "OK - Terminal de Emulador abierta. Espera 2 o 3 minutos" -ForegroundColor Green
	}
}

# Funcion para abrir una nueva terminal del Frontend
function Start-Frontend {
	Start-Process powershell -ArgumentList "-NoExit", "-Command `"cd 'C:\Users\Admin\source\repos\brt-mobile\brt-frontend'; flutter run`""
	Write-Host "OK - Terminal de Frontend abierta en nueva ventana" -ForegroundColor Green
}

# Funcion para listar emuladores
function List-Emulators {
	flutter emulators
}

# Funcion para ver salud del backend
function Check-Backend {
	$url = "http://localhost:3000/health"
	try {
		$response = Invoke-WebRequest -Uri $url -ErrorAction Stop
		Write-Host "OK - Backend esta funcionando" -ForegroundColor Green
	} catch {
		Write-Host "ERROR - Backend no esta corriendo. Usa Start-Backend" -ForegroundColor Red
	}
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   Funciones BRT MVP" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "flutter [comando] - Ejecutar Flutter" -ForegroundColor Green
Write-Host "dart [comando] - Ejecutar Dart" -ForegroundColor Green
Write-Host "List-Emulators - Ver emuladores" -ForegroundColor Green
Write-Host "Start-Backend - Ejecutar backend" -ForegroundColor Green
Write-Host "Start-Emulator - Ejecutar emulador" -ForegroundColor Green
Write-Host "Start-Frontend - Ejecutar app Flutter" -ForegroundColor Green
Write-Host "Check-Backend - Verificar backend" -ForegroundColor Green
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
