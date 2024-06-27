package com.ScuolaWebService2.controller;

import com.ScuolaWebService2.entity.Rubrica;
import com.ScuolaWebService2.librerie.ManageDb;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RequestMapping("/scuola")
@SecurityRequirement(name = "wsRestSecurityScheme")
@RestController
public class ScuolaController {
    ManageDb myDb = new ManageDb();


  /*  @GetMapping("/rubrica")
    public ArrayList<Rubrica> generaRubrica(){
        ArrayList<Rubrica> miaRubrica=new ArrayList<>();
        Rubrica rubrica1 = new Rubrica(1,"Mario", "Rossi", null, "mario.rossi@example.com", "+39 123456789", 1);
        Rubrica rubrica2 = new Rubrica(2,"Luca", "Bianchi", null, "luca.bianchi@example.com", "+39 987654321", 1);
        Rubrica rubrica3 = new Rubrica(3,"Giovanna", "Verdi", null, "giovanna.verdi@example.com", "+39 567890123", 1);
        Rubrica rubrica4 = new Rubrica(4,"Alessia", "Ferrari", null, "alessia.ferrari@example.com", "+39 1122334455", 1);
        Rubrica rubrica5 = new Rubrica(5,"Giorgio", "Romano", null, "giorgio.romano@example.com", "+39 9988776655", 1);

        miaRubrica.addAll(Arrays.asList(rubrica1, rubrica2, rubrica3,rubrica4,rubrica5));
        return miaRubrica;
    }*/

/*    @PutMapping("/rubricaupdate/{id}")
    public ResponseEntity<?> updateContatto(@PathVariable("id") int id, @RequestBody Rubrica rubrica) {
        String sql = "UPDATE contatto SET image = ?, email = ?, telefono = ? WHERE id = ?";

        try (Connection connection = myDb.Connect();
             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {

            // Set parameters for the prepared statement

            preparedStatement.setString(1, rubrica.getImage());
            preparedStatement.setString(2, rubrica.getEmail());
            preparedStatement.setString(3, rubrica.getTelefono());
            preparedStatement.setInt(4, id);

            // Execute the update query
            int rowsAffected = preparedStatement.executeUpdate();
            if (rowsAffected > 0) {
                System.out.println("Contatto updated successfully");
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(404).body("Contatto not found with id: " + id);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error occurred: " + e.getMessage());
        }
    }*/

    @PutMapping("/rubricaupdate/{id}")
    public ResponseEntity<?> updateContatto(@PathVariable("id") int id,
                                            @RequestParam("nome") String nome,
                                            @RequestParam("cognome") String cognome,
                                            @RequestParam(value = "image", required = false) MultipartFile image,
                                            @RequestParam("email") String email,
                                            @RequestParam("telefono") String telefono,
                                            @RequestParam("citta") String citta,
                                            @RequestParam("indirizzo") String indirizzo) {
        String sql = "UPDATE contatto SET nome = ?, cognome = ?, email = ?, telefono = ?, citta = ?, indirizzo= ?";

        // Check if image is provided and update accordingly
        if (image != null && !image.isEmpty()) {
            sql += ", image = ?";
        }

        sql += " WHERE id = ?";

        try (Connection connection = myDb.Connect();
             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {

            preparedStatement.setString(1, nome);
            preparedStatement.setString(2, cognome);
            preparedStatement.setString(3, email);
            preparedStatement.setString(4, telefono);
            preparedStatement.setString(5, citta);
            preparedStatement.setString(6, indirizzo);

            int parameterIndex = 7; // Start index for image parameter if included
            if (image != null && !image.isEmpty()) {
                // Save the new file to the specified directory
                String fileName = storeFile(image);
                preparedStatement.setString(parameterIndex++, fileName);
            }

            preparedStatement.setInt(parameterIndex, id);

            // Execute the update query
            int rowsAffected = preparedStatement.executeUpdate();
            if (rowsAffected > 0) {
                System.out.println("Contatto aggiornato");
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(404).body("Contatto non trovato per id: " + id);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Errore: " + e.getMessage());
        }
    }


    @PostMapping("/rubricadelete")
    public ResponseEntity<?> cambiaStatoRubrica(@RequestBody int[] ids) {

        String sql = "UPDATE contatto SET stato = 0 WHERE id = ?";

        try (Connection connection = myDb.Connect();
             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {

            for (int id : ids) {
                preparedStatement.setInt(1, id);
                preparedStatement.executeUpdate();
            }

            return ResponseEntity.ok("Contacts deleted successfully");

        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error occurred: " + e.getMessage());
        }
    }

    @Value("${file.upload.directory}")
    private String uploadDirectory; // Injects the property value from application.properties


    @PostMapping(value = "/rubricainsert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> insertRubrica(@RequestParam("nome") String nome,
                                           @RequestParam("cognome") String cognome,
                                           @RequestParam("image") MultipartFile image,
                                           @RequestParam("email") String email,
                                           @RequestParam("telefono") String telefono,
                                           @RequestParam("citta") String citta,
                                           @RequestParam("indirizzo") String indirizzo,
                                           @RequestParam("nascita") LocalDate nascita,
                                           @RequestParam("stato") int stato) {
        String sql = "INSERT INTO contatto (nome, cognome, image, email, telefono, citta, indirizzo, dataNascita, stato) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection connection = myDb.Connect();
             PreparedStatement preparedStatement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            preparedStatement.setString(1, nome);
            preparedStatement.setString(2, cognome);

            // Save the file to the specified directory
            String fileName = storeFile(image);

            preparedStatement.setString(3, fileName); // Save the filename in the database
            preparedStatement.setString(4, email);
            preparedStatement.setString(5, telefono);
            preparedStatement.setString(6, citta);
            preparedStatement.setString(7, indirizzo);

            // Convert LocalDate to java.sql.Date
            Date sqlDateNascita = Date.valueOf(nascita);
            preparedStatement.setDate(8, sqlDateNascita);

            preparedStatement.setInt(9, stato);

            int rowsAffected = preparedStatement.executeUpdate();

            if (rowsAffected > 0) {
                ResultSet generatedKeys = preparedStatement.getGeneratedKeys();
                if (generatedKeys.next()) {
                    int id = generatedKeys.getInt(1);
                    Rubrica newRubrica = new Rubrica(id, nome, cognome, fileName, email, telefono, citta, indirizzo, nascita, stato);
                    return ResponseEntity.ok(newRubrica);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante generare ID");
                }
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante creazione di rubrica entry");
            }

        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore: " + e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
    private String storeFile(MultipartFile file) throws IOException {
        String originalFileName = file.getOriginalFilename();
        String fileName = UUID.randomUUID().toString() + "_copy" + originalFileName;

        Path filePath = Paths.get(uploadDirectory + File.separator + fileName);

        try (OutputStream outputStream = Files.newOutputStream(filePath)) {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            // Handle exception
            throw new RuntimeException("Failed to store file: " + ex.getMessage());
        }

        return fileName;
    }
    @GetMapping("/rubricadb")
    public ArrayList<Rubrica> generaContattiRubrica() {
        ArrayList<Rubrica> miaRubrica = new ArrayList<>();
            String sqlQuery = "SELECT * FROM contatto" ;

            try (Connection conn = myDb.Connect();
                 PreparedStatement pStatement = conn.prepareStatement(sqlQuery)) {

                try(ResultSet resultSet = pStatement.executeQuery()){
                    while (resultSet.next()) {
                        Rubrica rubrica = new Rubrica();
                        rubrica.setId(resultSet.getInt("id"));
                        rubrica.setNome(resultSet.getString("nome"));
                        rubrica.setCognome(resultSet.getString("cognome"));
                        rubrica.setImage(resultSet.getString("image"));
                        rubrica.setEmail(resultSet.getString("email"));
                        rubrica.setTelefono(resultSet.getString("telefono"));
                        rubrica.setCitta(resultSet.getString("citta"));
                        rubrica.setIndirizzo(resultSet.getString("indirizzo"));
                        rubrica.setNascita(resultSet.getDate("dataNascita").toLocalDate());
                        rubrica.setStato(resultSet.getInt("stato"));
                        miaRubrica.add(rubrica);
                    }
                }

            } catch (SQLException e) {
                e.printStackTrace();
            }

        return miaRubrica;
    }


}
