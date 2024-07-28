# innova_sphere
Hack'ndore

# Steps to Run

1. Clone the repository.
2. Ensure you have Node.js installed.
3. Change directory (cd) into the main folder.
4. Run `npm install` to install dependencies.
5. Setup Ollama server:
   - Run the following commands in your terminal:
     ```sh
     curl -fsSL https://ollama.com/install.sh | sh
     ollama serve
     ```
   - In a new terminal, run:
     ```sh
     ollama pull llama3.1
     ollama create trainmodel -f ./Modelfile
     ```
6. Create and initialize MySQL Server:
   - Update package lists:
     ```sh
     sudo apt update
     ```
   - Install MySQL server:
     ```sh
     sudo apt install mysql-server
     ```
   - Secure MySQL installation:
     ```sh
     sudo mysql_secure_installation
     ```
     (Give no password for now)
   - Initialize MySQL database:
     ```sh
     sudo mysql -u root -p < initialize.sql
     ```
7. Run `npm start` to start the application.