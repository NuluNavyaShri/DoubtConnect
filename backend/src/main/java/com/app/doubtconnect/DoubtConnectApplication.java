package com.app.doubtconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class DoubtConnectApplication {


	public static void main(String[] args) {
		SpringApplication.run(DoubtConnectApplication.class, args);
	}

}
