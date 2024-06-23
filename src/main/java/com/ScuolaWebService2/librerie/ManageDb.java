package com.ScuolaWebService2.librerie;

import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Properties;

public class ManageDb {
	public Connection myConn;
	Statement statement;
	ResultSet resultSet;
	//private final String fileProperties ="src" + File.separator + "main" + File.separator + "resources" + File.separator + "config.properties";
	//private final String fileProperties ="C:\\Users\\Studente4.5\\IdeaProjects\\ProvaServlet\\ServletIntellij2105\\src\\main\\resources\\config.properties";
	private final String fileProperties = "application.properties";


	//host, port, db sono in resouces/application.peroperties
	public Connection Connect() {

		Properties properties = new Properties();
		myConn = null;
		boolean isConn = false;

		try (InputStream input = getClass().getClassLoader().getResourceAsStream(fileProperties)) {
			if (input == null) {
				System.out.println("Non posso trovare" + fileProperties);
				return null;
			}
			properties.load(input);

			String connection = properties.getProperty("url") + "://" +
					properties.getProperty("host") + ":" +
					properties.getProperty("port") + "/" +
					properties.getProperty("database") + "?user=" +
					properties.getProperty("user") + "&password=" +
					properties.getProperty("password") + "&useSSL=false&serverTimezone=Europe/Rome";

			myConn = DriverManager.getConnection(connection);
			if (myConn != null) {
				System.out.println("Connesso a db con successo!");
				//isConn = true;
			} else {
				//isConn = false;
				System.out.println("NON connesso al db");
			}
		} catch (IOException e) {
			System.out.println("Problema in lettura file: " + e.getMessage());
		} catch (SQLException e) {
			System.out.println("Non posso fare la connessione alla db: " + e.getMessage());
		}
		return myConn;
	}



/*
	public boolean Connect(String sIpServer, int iPort, String sNomeDb, String sNomeUtente, String sPass)
	{
		String sConnectString;

		sConnectString = "jdbc:mysql://" + sIpServer + ":" + iPort + "/" + sNomeDb +
				"?user=" + sNomeUtente + "&password=" + sPass + "&serverTimezone=Europe/Amsterdam";
		try {
			myConn = DriverManager.getConnection(sConnectString);
			return true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}*/

	public boolean writeInDb(String sSqlQuery) {
		boolean isExecuted = false;
		try {
			statement = myConn.createStatement();
			int rowsAffected = statement.executeUpdate(sSqlQuery);
			isExecuted = rowsAffected > 0;
			System.out.println("Inserito in database con successo");
		} catch (SQLException e) {
			System.out.println("Inserimento in db non è andato con successo: " + e);
		}
		return isExecuted;
	}


	public ResultSet readInDb(String sSqlQuery) {
		try {
			statement = myConn.createStatement();
			resultSet = statement.executeQuery(sSqlQuery);
			if (resultSet == null) System.out.println("Non ci sono records con i parametri cercati");
		} catch (SQLException e) {
			System.out.println("Tentativo di leggere in db non è andato con successo" + e);
		}
		return resultSet;
	}

	public boolean disconnect() {
		try {
			myConn.close();
			System.out.println("Connessione con db è chiusa");
			return true;
		} catch (SQLException e) {
			System.out.println("Non posso chiudere connessione db" + e);
		}
		return false;
	}

	public Connection getMyConn() {
		return myConn;
	}
	
}
