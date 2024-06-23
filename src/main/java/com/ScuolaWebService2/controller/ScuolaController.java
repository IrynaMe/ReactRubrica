package com.ScuolaWebService2.controller;


import com.ScuolaWebService2.CategoriaUtente;
import com.ScuolaWebService2.entity.Persona;
import com.ScuolaWebService2.entity.Rubrica;
import com.ScuolaWebService2.entity.Utente;
import com.ScuolaWebService2.librerie.ManageDb;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

@CrossOrigin(origins = "*")
@RequestMapping("/scuola")
@SecurityRequirement(name = "wsRestSecurityScheme")
@RestController
public class ScuolaController {
    ManageDb myDb = new ManageDb();



    @RequestMapping(value = "/{tipoScuola}", method = RequestMethod.GET)
    public ArrayList<CategoriaUtente> categorie(@PathVariable("tipoScuola") int tipoScuola) {
        return generaListaCategorie(tipoScuola);
    }



    @PostMapping("/login/2")
    public ArrayList<Persona> allieviDelDocente(@RequestBody Utente utente) {
        ArrayList<Persona> result = new ArrayList<>();
        String queryTrovaUtente = "SELECT * FROM utente WHERE username = ? AND password = ?";
        try (Connection conn = myDb.Connect();
             PreparedStatement pStatement = conn.prepareStatement(queryTrovaUtente)) {
            pStatement.setString(1, utente.getUsername());
            pStatement.setString(2, utente.getPassword());
           try( ResultSet resultSet = pStatement.executeQuery()){
               if (resultSet.next()) {

                   utente.setAbilitato(resultSet.getInt("abilitato"));
                   if (utente.getAbilitato() == 1) {
                       utente.setProfilo(resultSet.getInt("profilo"));
                       if(utente.getProfilo()==2){
                           utente.setCf_docente(resultSet.getString("cf_docente"));
                       }else{
                           System.out.println("utente non è docente");
                           return result;
                       }
                   } else {
                       System.out.println("utente non è abilitato");
                       return result;
                   }
               } else {
                   System.out.println("utente non trovato");
                   return result;
               }
           }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return generaListaAllievi(utente);
    }

    @GetMapping("/rubrica")
    public ArrayList<Rubrica> generaRubrica(){
        ArrayList<Rubrica> miaRubrica=new ArrayList<>();
        Rubrica rubrica1 = new Rubrica(1,"Mario", "Rossi", null, "mario.rossi@example.com", "+39 123456789", 1);
        Rubrica rubrica2 = new Rubrica(2,"Luca", "Bianchi", null, "luca.bianchi@example.com", "+39 987654321", 1);
        Rubrica rubrica3 = new Rubrica(3,"Giovanna", "Verdi", null, "giovanna.verdi@example.com", "+39 567890123", 1);
        Rubrica rubrica4 = new Rubrica(4,"Alessia", "Ferrari", null, "alessia.ferrari@example.com", "+39 1122334455", 1);
        Rubrica rubrica5 = new Rubrica(5,"Giorgio", "Romano", null, "giorgio.romano@example.com", "+39 9988776655", 1);

        miaRubrica.addAll(Arrays.asList(rubrica1, rubrica2, rubrica3,rubrica4,rubrica5));
        return miaRubrica;
    }

    @PutMapping("/rubricaupdate/{id}")
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

    @PostMapping(value = "/rubricainsert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> insertRubrica(@RequestParam("nome") String nome,
                                           @RequestParam("cognome") String cognome,
                                           @RequestParam("image") MultipartFile image,
                                           @RequestParam("email") String email,
                                           @RequestParam("telefono") String telefono,
                                           @RequestParam("stato") int stato) {
        String sql = "INSERT INTO contatto (nome, cognome, image, email, telefono, stato) VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection connection = myDb.Connect();
             PreparedStatement preparedStatement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            preparedStatement.setString(1, nome);
            preparedStatement.setString(2, cognome);
            preparedStatement.setString(3, image.getOriginalFilename()); // Save the filename or handle file storage
            preparedStatement.setString(4, email);
            preparedStatement.setString(5, telefono);
            preparedStatement.setInt(6, stato);

            int rowsAffected = preparedStatement.executeUpdate();

            if (rowsAffected > 0) {
                ResultSet generatedKeys = preparedStatement.getGeneratedKeys();
                if (generatedKeys.next()) {
                    int id = generatedKeys.getInt(1);
                    Rubrica newRubrica = new Rubrica(id, nome, cognome, image.getOriginalFilename(), email, telefono, stato);
                    return ResponseEntity.ok(newRubrica);
                } else {
                    return ResponseEntity.status(500).body("Failed to retrieve generated ID");
                }
            } else {
                return ResponseEntity.status(500).body("Failed to create rubrica entry");
            }

        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error occurred: " + e.getMessage());
        }
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
                        rubrica.setStato(resultSet.getInt("stato"));
                        miaRubrica.add(rubrica);
                    }
                }

            } catch (SQLException e) {
                e.printStackTrace();
            }

        return miaRubrica;
    }



 public ArrayList<Persona> generaListaAllievi(Utente utente) {
        ArrayList<Persona> listaAllievi = new ArrayList<>();
        if (utente.getProfilo() != 2) {
            System.out.println("Utente non è autorizzato per operazione docente");
            return listaAllievi;
        }

        if (utente.getCf_docente() != null) {
            String sqlQuery = "SELECT DISTINCT allievo.nome, allievo.cognome, allievo.cf, allievo.email " +
                    "FROM allievo " +
                    "INNER JOIN allievo_in_classe ON allievo.cf = allievo_in_classe.cf_allievo " +
                    "INNER JOIN docente_classe ON docente_classe.livello_classe = allievo_in_classe.livello_classe " +
                    "AND docente_classe.sezione_classe = allievo_in_classe.sezione_classe " +
                    "WHERE docente_classe.cf_docente = ?";

            try (Connection conn = myDb.Connect();
                 PreparedStatement pStatement = conn.prepareStatement(sqlQuery)) {
                pStatement.setString(1, utente.getCf_docente());
               try(ResultSet resultSet = pStatement.executeQuery()){
                   while (resultSet.next()) {
                       Persona allievo = new Persona();
                       allievo.setNome(resultSet.getString("nome"));
                       allievo.setCognome(resultSet.getString("cognome"));
                       allievo.setCf(resultSet.getString("cf"));
                       allievo.setEmail(resultSet.getString("email"));
                       listaAllievi.add(allievo);
                   }
                }

            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return listaAllievi;
    }


    private ArrayList<CategoriaUtente> generaListaCategorie(int tipoScuola) {
        ArrayList<CategoriaUtente> listCat = new ArrayList<>();
        CategoriaUtente cat1 = new CategoriaUtente(2, "Docenti Scuola Elementare",
                "Sezione dedicata agli insegnanti per la gestione del loro classi",
                "teacher.png", "Accedi");
        CategoriaUtente cat2 = new CategoriaUtente(3, "Alunni Scuola Elementare",
                "Sezione dedicata agli alunni per prenotazione prove e visualizzazione voti",
                "backpack.png", "Accedi");
        CategoriaUtente cat3 = new CategoriaUtente(1, "Amministrativi",
                "Sezione dedicata agli amministrativi per la gestione delle classi",
                "folder.png", "Accedi");
        CategoriaUtente cat4 = new CategoriaUtente(4, "Famiglie",
                "Sezione dedicata alle famiglie",
                "home.png", "Accedi");
        CategoriaUtente cat5 = new CategoriaUtente(2, "Docenti Scuola Media",
                "Sezione dedicata agli insegnanti per la gestione del loro classi",
                "teacher.png", "Accedi");
        CategoriaUtente cat6 = new CategoriaUtente(3, "Alunni Scuola Media",
                "Sezione dedicata agli alunni per prenotazione prove e visualizzazione voti",
                "backpack.png", "Accedi");
        CategoriaUtente cat7 = new CategoriaUtente(2, "Docenti Scuola Superiore",
                "Sezione dedicata agli insegnanti per la gestione del loro classi",
                "teacher.png", "Accedi");
        CategoriaUtente cat8 = new CategoriaUtente(3, "Alunni Scuola Superiore",
                "Sezione dedicata agli alunni per prenotazione prove e visualizzazione voti",
                "backpack.png", "Accedi");
        switch (tipoScuola) {
            case 0:
                listCat.add(cat1);
                listCat.add(cat2);
                listCat.add(cat3);
                listCat.add(cat4);
                break;
            case 1:
                listCat.add(cat5);
                listCat.add(cat6);
                listCat.add(cat3);
                listCat.add(cat4);
                break;
            case 2:
                listCat.add(cat7);
                listCat.add(cat8);
                listCat.add(cat3);
                listCat.add(cat4);
                break;
            default:
                return null;
        }
        return listCat;
    }


    @RequestMapping(value = "prova/input", method = RequestMethod.POST)
    public boolean provaCreate(String key, String saluto) {
        HashMap saluti = new HashMap();
        saluti.put(key, saluto);
        return true;
    }




/*
    @PostMapping("/login/2")
    public HashMap<Persona,String> allieviDelDocente(@RequestBody Utente utente) {
        HashMap<Persona,String> result = new HashMap<>();
        // Utente currUtente = new Utente();

        String queryTrovaUtente = "SELECT * FROM utente WHERE username = ? AND password = ?";
        try (Connection conn = myDb.Connect();
             PreparedStatement pStatement = conn.prepareStatement(queryTrovaUtente)) {
            pStatement.setString(1, utente.getUsername());
            pStatement.setString(2, utente.getPassword());
            ResultSet resultSet = pStatement.executeQuery();

            if (resultSet.next()) {
                //  currUtente.setPassword(password);
                // currUtente.setUsername(username);
                utente.setAbilitato(resultSet.getInt("abilitato"));
                if (utente.getAbilitato() == 1) {
                    utente.setProfilo(resultSet.getInt("profilo"));
                    if(utente.getProfilo()==2){
                        utente.setCf_docente(resultSet.getString("cf_docente"));
                    }else{
                        System.out.println("utente non è docente");
                        return result;
                    }
                } else {
                    System.out.println("utente non è abilitato");
                    return result;
                }
            } else {
                System.out.println("utente non trovato");
                return result;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return generaListaAllievi(utente);
    }
    public HashMap<Persona,String > generaListaAllievi(Utente utente) {
        HashMap<Persona,String> listaAllievi = new HashMap<>();

        if (utente.getProfilo() != 2) {
            System.out.println("Utente non è autorizzato per operazione docente");
            return listaAllievi;
        }

        if (utente.getCf_docente() != null) {
            String sqlQuery = "SELECT DISTINCT allievo.nome, allievo.cognome, allievo.cf, allievo.email,allievo_in_classe.livello_classe,allievo_in_classe.sezione_classe  " +
                    "FROM allievo " +
                    "INNER JOIN allievo_in_classe ON allievo.cf = allievo_in_classe.cf_allievo " +
                    "INNER JOIN docente_classe ON docente_classe.livello_classe = allievo_in_classe.livello_classe " +
                    "AND docente_classe.sezione_classe = allievo_in_classe.sezione_classe " +
                    "WHERE docente_classe.cf_docente = ?";

            try (Connection conn = myDb.Connect();
                 PreparedStatement pStatement = conn.prepareStatement(sqlQuery)) {
                pStatement.setString(1, utente.getCf_docente());
                ResultSet resultSet = pStatement.executeQuery();
                while (resultSet.next()) {
                    String livelloSezione=null;
                    Persona allievo = new Persona();
                    allievo.setNome(resultSet.getString("nome"));
                    allievo.setCognome(resultSet.getString("cognome"));
                    allievo.setCf(resultSet.getString("cf"));
                    allievo.setEmail(resultSet.getString("email"));
                    livelloSezione=resultSet.getString("livello_classe")+resultSet.getString("sezione_classe");
                    listaAllievi.put(allievo,livelloSezione);
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return listaAllievi;
    }
*/
 /*   @PostMapping("/rubricainsert")
    public ResponseEntity<?> insertRubrica(@RequestBody Rubrica rubrica) {
        String sql = "INSERT INTO contatto (nome, cognome, image, email, telefono, stato) VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection connection = myDb.Connect();
             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {

            preparedStatement.setString(1, rubrica.getNome());
            preparedStatement.setString(2, rubrica.getCognome());
            preparedStatement.setString(3, rubrica.getImage());
            preparedStatement.setString(4, rubrica.getEmail());
            preparedStatement.setString(5, rubrica.getTelefono());
            preparedStatement.setInt(6, rubrica.getStato());

            int rowsAffected = preparedStatement.executeUpdate();

            if (rowsAffected > 0) {
                return ResponseEntity.ok("Rubrica entry created successfully");
            } else {
                return ResponseEntity.status(500).body("Failed to create rubrica entry");
            }

        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error occurred: " + e.getMessage());
        }
    }*/
}
