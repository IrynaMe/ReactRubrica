package com.ScuolaWebService2.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Persona {
	private String cf;
	private String nome;
	private String cognome;
	private String sesso;
	private String statoNascita;
	private String provinciaNascita;
	private String comuneNascita;
	private LocalDate dataNascita;
	private String email;
	private int abilitato; //1-true, 0 false- default 1 in db

	public Persona(String cf, String nome, String cognome, String email) {
		this.cf = cf;
		this.nome = nome;
		this.cognome = cognome;
		this.email = email;
	}


} //