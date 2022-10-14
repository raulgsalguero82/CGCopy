# Enlaces   

- [Jenkins](http://157.253.238.75:8080/jenkins-misovirtual/view/MISW4403/job/MISW4403_202214_Equipo14/)
- [Sonar](http://157.253.238.75:8080/sonar-misovirtual/dashboard?id=MISW4403_202214_Equipo14%3Asonar)
- [GitInspector](https://misw-4104-web.github.io/MISW4403_202214_Equipo14/reports/)

> Si el link de Jenkins no funciona, ir a la pantalla de [login](http://157.253.238.75:8080/jenkins-misovirtual/)
> primero

# Instalación

* [Instalación local](#local)
* [Instalación docker](#docker)

## Local
Es necesario tener postgres corriendo en local
### Instalar node

Se sugiere usar nvm. Para instalar nvm siga las instrucciones de la [documentación](https://github.com/nvm-sh/nvm#installing-and-updating)

#### Seleccionar la versión adecuada de node
```bash
nvm use
```
> Si no tiene la versión instalada, siga las instrucciones mostradas 
> en la terminal e intente el comando nuevamente.

### Instalar nest
```bash
npm install -g @nestjs/cli@9.1.1
```
### Instalar dependencias
```bash
npm ci
```

### Activar el servidor en modo desarrollo
```bash
npm run start:dev
```

### Correr los tests
```bash
npm run test:cov
```

## Docker

### Construír las imágenes

> En caso de usar una versión antigua de docker, usar
> `docker-compose` en lugar de `docker compose`.

```bash
export DOCKER_BUILDKIT=1
docker compose build
```
En caso de correr el proyecto por primera vez:

```bash
docker compose run app npm ci
```

### Levantar el proyecto
```bash
docker compose up
```
Para parar el proyecto usar `ctl+c` o si se usó en modo
detached, usar `docker compose stop`

Para limpiar el proyecto usar `docker compose down` o si
se desea eliminar la información de la base de datos, usar
`docker compose down --volumes`.

### Correr los tests
```bash
docker compose run app npm run test:cov
```
