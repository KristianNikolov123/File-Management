# Документация за проект: Система за управление на файлове с Docker Compose, NFS и Keycloak

---

## 1. Въведение

### Цел на проекта

Целта на този проект е да разработи система за управление на файлове, използвайки Docker Compose, NFS (Network File System) и Keycloak за удостоверяване чрез JWT токени. Системата трябва да предоставя функционалности за качване, четене, обновяване и изтриване на файлове, които се съхраняват в NFS.

---

## 2. Изисквания

### 2.1 Инфраструктура с Docker Compose

- Да се създаде `docker-compose.yml` файл, който дефинира следните услуги:
  1. **NFS сървър** – за съхранение на файлове.
  2. **Keycloak** – за управление на потребители и удостоверяване.
  3. **Приложение** – REST API за управление на файлове.

### 2.2 Keycloak и JWT удостоверяване

- Настройка на Keycloak:
  - Създаване на realm.
  - Конфигуриране на клиент за приложението.
  - Реализиране на роли или групи с ограничени права за достъп.
- Използване на JWT токени за удостоверяване и авторизация на потребителите.

### 2.3 NFS backend

- Настройка на NFS сървър за:
  - Качване на файлове.
  - Четене на файлове.
  - Обновяване на файлове.
  - Изтриване на файлове.

### 2.4 Приложение

- Приложението трябва да предоставя следните крайни точки:
  - **POST /file/upload**: Качва нов файл.
  - **GET /file/{file_id}**: Връща съдържанието на файл.
  - **PUT /file/{file_id}**: Обновява съществуващ файл.
  - **DELETE /file/{file_id}**: Изтрива файл.
- Логване на заявки и обработка на грешки.

### 2.5 GitHub Repository

- Организация на кода в директории:
  - `src/` – изходен код.
  - `config/` – конфигурационни файлове.
  - `docs/` – документация.
- README файл с инструкции за стартиране и използване на проекта.

---

## 3. Настройка и стартиране

### 3.1 Инсталация

1. Уверете се, че Docker и Docker Compose са инсталирани на вашата система.
2. Клонирайте репозитория:
   ```bash
   git clone <repository_url>
   cd <repository_directory>

3. За стартиране на проекта:
   docker-compose up


### 3.2 Конфигурация на Keycloak

1. Достъп до Keycloak административен панел:
   - URL: `http://localhost:<keycloak_port>`
   - Влезте с административния акаунт, създаден при стартиране.
2. Настройте realm и клиент:
   - Създайте нов realm (напр. `file-management`).
   - Добавете клиент със следните параметри:
     - **Client ID**: `file-app`.
     - **Access Type**: `confidential`.
   - Създайте роля (напр. `user`) и асоциирайте я с потребители.

---

### 3.3 Настройка на NFS

1. Уверете се, че NFS сървърът е настроен и работи.
2. Създайте директория за съхранение на файлове на NFS сървъра.
3. Уверете се, че директорията за съхранение е монтирана правилно в контейнера за приложението чрез `docker-compose.yml`.

---

### 4. API спецификация

### Взимане на JWT токен

- **Описание**: Получаване на JWT токен от Keycloak.
- **Примерна заявка (cURL)**:
   ```bash
   curl -X POST "http://localhost:8080/realms/myapp/protocol/openid-connect/token" \
   -H "Content-Type: application/x-www-form-urlencoded" \
   -d "grant_type=password" \
   -d "client_id=test" \
   -d "username=test" \
   -d "password=1234" \
   -d "email=test@gmail.com" \
   -d "client_secret=gqZEpo2PpCDNkwd9as15YVXLFFp1nXWq"

#### Крайни точки

1. **POST /file/upload**
   - **Описание**: Качва нов файл.
   - **Примерна заявка (cURL)**:
     ```bash
     curl -X POST -H "Authorization: Bearer <JWT_TOKEN>" -F "file=@<file_path>" http://localhost:8080/file/upload
     ```

2. **GET /file/{file_id}**
   - **Описание**: Извлича файл по идентификатор.
   - **Примерна заявка (cURL)**:
     ```bash
     curl -X GET -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:8080/file/<file_id>
     ```

3. **PUT /file/{file_id}**
   - **Описание**: Обновява съществуващ файл.
   - **Примерна заявка (cURL)**:
     ```bash
     curl -X PUT -H "Authorization: Bearer <JWT_TOKEN>" -F "file=@<new_file_path>" http://localhost:8080/file/<file_id>
     ```

4. **DELETE /file/{file_id}**
   - **Описание**: Изтрива файл по идентификатор.
   - **Примерна заявка (cURL)**:
     ```bash
     curl -X DELETE -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:8080/file/<file_id>
     ```

---
