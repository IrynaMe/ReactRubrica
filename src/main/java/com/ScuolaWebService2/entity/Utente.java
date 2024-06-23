package com.ScuolaWebService2.entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Utente implements Serializable {
    private String username;
    private String password;
    private int abilitato=1;
    private int profilo;
    private String cf_allievo;
    private String cf_docente;
    private String cf_amministrativo;

}