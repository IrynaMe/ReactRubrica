package com.ScuolaWebService2.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Rubrica implements Serializable {
    private int id;//autoincrement in database
    private String nome;
    private String cognome;
    private String image;
    private String email;
    private String telefono;
    private String citta;
   private String indirizzo;
   private LocalDate nascita;
    private int stato;

    public Rubrica(String nome, String cognome, String image, String email, String telefono, String citta, String indirizzo, LocalDate nascita, int stato) {
        this.nome = nome;
        this.cognome = cognome;
        this.image = image;
        this.email = email;
        this.telefono = telefono;
        this.citta = citta;
        this.indirizzo = indirizzo;
        this.nascita = nascita;
        this.stato = stato;
    }
}

