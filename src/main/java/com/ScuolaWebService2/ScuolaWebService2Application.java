package com.ScuolaWebService2;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@OpenAPIDefinition(info = @Info(title = "wsrest API", version = "3.0", description = "wsrest"))
@SpringBootApplication
@SecurityScheme(
		name = "wsRestSecurityScheme",
		type = SecuritySchemeType.HTTP,
		bearerFormat = "JWT",
		scheme = "bearer"
)
public class ScuolaWebService2Application {

	public static void main(String[] args) {
		SpringApplication.run(ScuolaWebService2Application.class, args);
	}

}
