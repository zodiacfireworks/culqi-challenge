# Culqi Challenge: Tokenizer Service

## Requerimientos

Para la ejecución del proyecto en un entorno local se recomienda contar con las siguientes herramientas:

* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/)

El proyecto fue desarrollado con Node v18.17.1, yarn v1.22.19 empleando el framework [NestJS](https://nestjs.com/) y se encuentra dockerizado por lo que no es necesario instalar node ni yarn en el entorno local.

## Instalación

1. Dirigete a tu carpeta de trabajo y clona el repositorio

```bash
git clone git@github.com:zodiacfireworks/culqi-challenge.git
```

2. Ingresa a la carpeta del proyecto

```bash
cd culqi-challenge
```

3. Crea el archivo .env a partir del archivo .env.template

```bash
cp .env.template .env
```

Lee las instrucciones del archivo .env.template para configurar las variables de entorno de forma correcta.

4. Construye la imagen de docker

```bash
docker compose build
```

5. Levanta los contenedores de docker

```bash
docker compose up
```

6. Dirigete a la url http://127.0.0.1:3000 para acceder a la documentación de la API

![Swagger](./_assets/swagger.png)

## Ejecución de pruebas

1. Para ejecutar las pruebas unitaras se debe emplear el siguiente comando:

```bash
docker compose exec tokenizer-service yarn run test
```

![Tests](_assets/tests.png)

1. Para ejecutar las pruebas con cobertura se debe emplear el siguiente comando:

```bash
docker compose exec tokenizer-service yarn run test:cov
```

![Tests con cobertura](_assets/tests_cov.png)

3. Para ejecutar las pruebas de integración se debe emplear el siguiente comando:

```bash
docker compose exec tokenizer-service yarn run test:e2e
```

![Tests de intergación](_assets/tests_e2e.png)

## Despliegue


## Notas y comentarios:

### Desarrollo

### Despliegue

### Seguridad

### Observabilidad
