---
name: "DentissaApp — Auth Microservice"
order: 2
status: "in-progress"
stack:
  - "Java"
  - "Spring Boot"
  - "PostgreSQL"
  - "Docker"
  - "JUnit"
  - "OAuth 2.0"
  - "JWT"
  - "Azure App Service"
---

- Diseñé y desacoplé un microservicio independiente de autenticación, usuarios y roles a partir del monolito principal en Laravel, construido con Java (Spring Boot) y PostgreSQL.
- Se implementará autenticación OAuth 2.0 con el proveedor de Google, además de gestión de sesiones basada en JWT para un acceso seguro a la API.
- Escribí pruebas unitarias y de integración con JUnit para las entidades principales; contenericé PostgreSQL con Docker, con migraciones de base de datos y un archivo de despliegue listo para Azure App Service.
