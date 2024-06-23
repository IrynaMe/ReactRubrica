package com.ScuolaWebService2.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

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
    private int stato;

    public Rubrica(String nome, String cognome, String image, String email, String telefono, int stato) {
        this.nome = nome;
        this.cognome = cognome;
        this.image = image;
        this.email = email;
        this.telefono = telefono;
        this.stato = stato;
    }
}

