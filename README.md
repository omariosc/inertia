# inertia

## Running the project

### via docker and docker-compose

The project contains a docker image for each component, and a docker-compose file that orchestrates
these images to be run as services. The configuration creates three services: `backend`, `fronted` and `nginx` 
(a reverse proxy that redirects to the `backend` and `frontend` components), a persistent volume for the `backend`
where the database is stored. This deployment is a production deployment, which means that all components
run in release mode.

####  Prerequisites
```sh
# install docker (or replacement) and docker-compose

# using official docker convinience script
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# using official docker-compose way of installation ()
curl -SL https://github.com/docker/compose/releases/download/v2.4.1/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Alternatively, on Fedora
# Installing podman as a drop in replacement for docker; and installing docker-compose from official repositories.
sudo dnf install podman docker-compose
```

#### Deployment
```shell
git clone https://gitlab.com/sc20aim/inertia
docker-compose up
```

### each component independently in development mode
#### Prerequisites
The project requires the following software packages in order to be built:
* dotnet sdk
* nodejs
* npm
* (optionally) doxygen for documentation generation
* (optionally) python3 for running backend tests

The following commands show how these packages can be acquired on Fedora Linux (34, 35):
```shell
sudo dnf install dotnet npm nodejs python3 python3-pip doxygen 
```

#### Backend
Running the backend in development mode can be done like so:
```shell
# assuming the current working directory is: inertia/backend
dotnet restore inertia.csproj
dotnet run
# the backend server will run on the URL: https://localhost:7220
```

#### Running the tests
```shell 
# assuming the current working directory is: inertia/backend-testing
pip3 install -r requirements.txt
python3 main.py https://localhost:7220
```

#### Building documentation
```shell
# assuming the current working directory is: inertia/backend
doxygen .doxygen
```

#### Frontend
Before running the frontend component, the file `frontend/src/host.js` must be modified to contain:
```js
// Backend host IP address.
let host = "https://localhost:7220";
export default host;
```
This will ensure that the frontend will connect to the backend that is running in the development mode.

```shell
# assuming the current working directory is: inertia/frontend
npm install
npm start
```
## Extras

### The architecture
The project is divided into two major components: `frontend` and `backend`.

* backend - a webservice that provides an API that implements all the business logic. 
This component was implements in `C#` using the `ASP.NET` framework.
* frontend - a Single Page Application that implements the browser UI for the project. In release
mode this components is built as a static page that can be served by an `nginx` instance.

In production mode, both of these components are packed as docker image, alongside with a third
components - the reverse proxy, whose job it is to provide a single front for the application.
The proxy handles user requests and redirects them either to the frontend `nginx` instance or to the
`backend` webservice.

### Interim Deliverables
The full interim deliverable specification list is listed [here](https://gitlab.com/sc20aim/inertia/-/wikis/interim) with hyperlinks to all links in the Wiki. It is recommended for any assessors reading this to follow those hyperlinks to make sure everything listed in the specification has been included in the repository.

### Documentation
Documentation of the project is available [here](https://gitlab.com/sc20aim/inertia/-/tree/main/documentation).

### Backend Documentation
Documentation of the backend component is available [here](https://gitlab.com/sc20aim/inertia/-/raw/main/documentation/backend.pdf).
