package com.ScuolaWebService2;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;
@Data @AllArgsConstructor
public class CategoriaUtente implements Serializable {
    private int id;
    private String nomeCat;
    private String descrCat;
    private String photo;
    private String linkCat;

}
